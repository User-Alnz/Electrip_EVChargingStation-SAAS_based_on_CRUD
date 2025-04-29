import type { LatLngTuple } from "leaflet";
import { useCallback, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "./DisplayMap.css";
import "leaflet/dist/leaflet.css";
import type L from "leaflet";
import { useCoordinates } from "../../contexts/EVStationContext.tsx";
import { useAuth } from "../../contexts/AuthContext.tsx";
import LeafletIconsRegister from "./markerIconsOnmap.ts";
import Loader from "../Loader/loader.tsx";

//Json return from /EVstations/?latitude=
type localisation = {
  id_station: string;
  n_station: string;
  ad_station: string;
  coordinates: LatLngTuple;  //[xlongitude: number, ylatitude: number];
  ylatitude: string;
  nbre_pdc: number;
  acces_recharge: string;
  puiss_max: number;
  type_prise: string;
  id_bornes: number[];
  available_bornes: boolean[];
};

//ExtendedLocalisation => the entries we only use
type ExtendedLocalisation = Omit<localisation, "coordinates"> & {
  id: number;
  coordinates: LatLngTuple; //location Latitude / Longitude
  id_bornes: number[];
  available_bornes: boolean[];
};

function LocationMarker() {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", (informationGeolocObject) => {
      setPosition(informationGeolocObject.latlng);
      map.flyTo(informationGeolocObject.latlng, map.getZoom());
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={LeafletIconsRegister.UserLocation}>
      <Popup>Vous êtes ici.</Popup>
    </Marker>
  );
}

function DisplayMap() {
  const [EVStationcoordinates, setEVStationCoordinates] = useState<
    ExtendedLocalisation[]
  >([]);
  const [isEVStationcoordinatesLoaded, setIsEVStationcoordinates] = useState<boolean>(false)
  const { setCoordinatesOfCurrentStation } = useCoordinates();
  const { location, setLocation } = useCoordinates();
  const { auth } = useAuth();

  //this function get latitude & longitude from browser  and use it later to fetch / get stations around user
  const getCurrentLocationOfUser = useCallback((): Promise<
    [number, number]
  > => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) =>
            resolve([position.coords.latitude, position.coords.longitude]),
          (error) => reject(error),
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  }, []);

  const handleMarkerClick = (item: ExtendedLocalisation) => {
    setCoordinatesOfCurrentStation(item);
  };

  //this function parse available_bornes from fetch to define which icone to use form LeafletIconsRegister.
  function defineWhichIconToPick(available_bornes: boolean[]) {
    const count = available_bornes.filter((borne) => borne).length; // get only if 1 || True

    if (available_bornes.length === count) {
      return LeafletIconsRegister.stationLocationBlue;
    }

    if (count === 0) {
      return LeafletIconsRegister.stationLocationRed;
    }

    if (count <= available_bornes.length / 2) {
      return LeafletIconsRegister.stationLocationYellow;
    }
    // return a default icon if any condition is met. to prevent component to break while running.
    return LeafletIconsRegister.stationLocationBlue;
  }

  function delay(milisecond : number) {
    return new Promise(resolve => setTimeout(resolve, milisecond));
  }

  useEffect(() => {
    //this function fetch/get all satision Arround user location
    const returnAllStationsAroundUSer = async () => {
      try {
        const newLocation: [number, number] = await getCurrentLocationOfUser();
        setLocation(newLocation);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/EVstations/?latitude=${newLocation[0]}&longitude=${newLocation[1]}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${auth?.token}`,
              'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) 
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        
        const data = await response.json();

        await delay(3000); // simply to run loader animation at least 3 second

        setEVStationCoordinates(data);
        setIsEVStationcoordinates(true);
      } catch (error) {
        console.error("Error fetching location or data:", error);
      }
    };

    returnAllStationsAroundUSer();
  }, [getCurrentLocationOfUser, setLocation]);

  return (
   
    <section>

      {!isEVStationcoordinatesLoaded ? (<Loader/>) : null}

        <MapContainer
          className="map"
          center={location} // Load map to Paris
          zoom={12}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          />

          {EVStationcoordinates.map((item) => (
          <Marker
            key={item.id}
            position={item.coordinates}
            icon={defineWhichIconToPick(item.available_bornes)}
            eventHandlers={{ click: () => handleMarkerClick(item) }}
                />
          ))}

          
          <LocationMarker />
        </MapContainer>

    </section>
  );
}

export default DisplayMap;
