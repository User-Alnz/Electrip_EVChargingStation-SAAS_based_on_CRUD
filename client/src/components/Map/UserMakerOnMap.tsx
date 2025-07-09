import { useState, useEffect } from "react";
import { useMap, Popup, Marker } from "react-leaflet";
import LeafletIconsRegister from "./markerIconsOnmap.ts";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type LocationMarkerProps = { 
    isAnswerYes : boolean
    location : [number, number]
    trigger : number,
  }
  
  function LocationMarker({isAnswerYes, location, trigger}: LocationMarkerProps)
  {
    const [position, setPosition] = useState< L.LatLng | null>(null);
  
    const map = useMap();
  
    useEffect(() => {
  
      const formatcoordinates = new L.LatLng(location[0], location[1]);
      setPosition(formatcoordinates);
  
      if(isAnswerYes === true || position !== null)
      {
        map.flyTo(formatcoordinates, map.getZoom());
      }
     
      map.locate().on("locationfound", (event : L.LocationEvent) => {
        setPosition(event.latlng);
        map.flyTo(event.latlng, map.getZoom());
      });
  
    }, [map, trigger]);

    return position === null ? null : (
        <Marker position={position} icon={LeafletIconsRegister.UserLocation}>
          <Popup>Vous êtes ici.</Popup>
        </Marker>
      );
}

export default LocationMarker;