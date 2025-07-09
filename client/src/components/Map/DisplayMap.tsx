import type { LatLngTuple } from "leaflet";
import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "./DisplayMap.css";
import "leaflet/dist/leaflet.css";
import { useCoordinates } from "../../contexts/EVStationContext.tsx";
import { useAuth } from "../../contexts/AuthContext.tsx";
import Loader from "../Loader/Loader.tsx";
import { useNavigate } from "react-router-dom";
import GetStationAroundUser from "../../api/GetStationAroundUser.tsx";
import { delay } from "../../util/GenerateDelay.ts";
import Modal from "../Modal/Modal.tsx";
import LocationMarker from "./UserMakerOnMap.tsx";
import { defineWhichIconToPick } from "./DisplayMapToolBox.ts";

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


function DisplayMap() 
{
  //Used in Useeffect => to secure fetch 
  const { auth, logout, setAuth } = useAuth();
  const navigate = useNavigate(); //use redirection 
  const [EVStationcoordinates, setEVStationCoordinates] = useState<ExtendedLocalisation[]>([]);
  const [isEVStationcoordinatesLoaded, setIsEVStationcoordinates] = useState<boolean>(false);
  const { setCoordinatesOfCurrentStation } = useCoordinates();
  const { location, setLocation } = useCoordinates();
  const callAPI = useRef<GetStationAroundUser|null>(null);
  const [showModalContext, setShowModalContext] = useState<null | "locationDenied" | "noStations">(null);
  const [isAnswerYes, setIsAnswerYes] = useState(false);
  const [triggerNewUseEffect, setTriggerNewUseEffect] = useState(0);

  //this function get latitude & longitude from browser  and use it later to fetch / get stations around user
  const getCurrentLocationOfUser = useCallback((): Promise<[number, number]> => 
  {
    return new Promise((resolve, reject) => 
    {
      if (navigator.geolocation) 
      {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve([position.coords.latitude, position.coords.longitude]),
          (error) => {
            
            //https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError
            if (error.code === error.PERMISSION_DENIED || // code 1
                error.code === error.POSITION_UNAVAILABLE || // code 2
                error.code === error.TIMEOUT) //code 3
                setShowModalContext("locationDenied");
          }
        );
      } 
      else 
      reject(new Error("Geolocation is not supported by this browser."));
      
    });
  }, []);

  const handleMarkerClick = (item: ExtendedLocalisation) => {
    setCoordinatesOfCurrentStation(item);
  };

  useEffect(() => {
    //this function fetch/get all satision Arround user location
    const returnAllStationsAroundUSer = async () => {
      try {
        let newLocation: [number, number];

        if(isAnswerYes === false)
        {
          newLocation = await getCurrentLocationOfUser();
          setLocation(newLocation);
        }
        else
        newLocation = location;

        callAPI.current = new GetStationAroundUser(auth?.token as string, logout, navigate, setAuth, newLocation);

        let  data;
        data = await callAPI.current.sendRequest();
        
        if( !Array.isArray(data) || data.length === 0)
        setShowModalContext("noStations");

        await delay(3000); // simply to run loader animation at least 3 second

        setEVStationCoordinates(data);
        setIsEVStationcoordinates(true);
      } catch (error) {
        console.error("Error fetching location or data:", error);
      }
    };

    returnAllStationsAroundUSer();
  }, [getCurrentLocationOfUser, setLocation, isAnswerYes, triggerNewUseEffect]);

  return (
   
    <section>

        {showModalContext === "locationDenied" && (
          <Modal
            title="Localisation refusée"
            message="Souhaitez-vous utiliser Paris comme position par défaut pour la démo ?"
            show={showModalContext}
            onConfirm={() => {
              setLocation(location);
              setIsAnswerYes(true);
              setShowModalContext(null);
            }}
            onCancel={() => {
              setShowModalContext(null);
              navigate("/");
            }}
          />
        )}

        {showModalContext === "noStations" && (
            <Modal
            title="Vous n'avez aucune station autour de votre position"
            message="Souhaitez-vous utiliser Paris comme position par défaut pour la démo ?"
            show={showModalContext}
            onConfirm={() => {
              setLocation([48.866667, 2.333333]); // Force mapping to Paris
              setIsAnswerYes(true);
              setTriggerNewUseEffect(value => value + 1);
              setShowModalContext(null);
            }}
            onCancel={() => {
              setShowModalContext(null);
              navigate("/");
            }}
          />
        )}

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

          
          <LocationMarker isAnswerYes={false} location={location} trigger={triggerNewUseEffect}/>
        </MapContainer>

    </section>
  );
}

export default DisplayMap;
