import Wire from "/mini_icone_borne.png";
import "./banner.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCoordinates } from "../../contexts/EVStationContext.tsx";
import { useAuth } from "../../contexts/AuthContext.tsx";

import { useNavigate } from "react-router-dom";
import PutBookABorne from "../../api/PutBookABorne.tsx";

function banner() {

  //Used in Useeffect => to secure fetch 
  const { auth, logout, setAuth } = useAuth();
  const navigate = useNavigate();
  const ApiCall = useRef<PutBookABorne|null>(null);
  const { coordinatesOfCurrentStation } = useCoordinates();
  const [available, setAvailable] = useState(false);


  //--- This  functions check if there is available bornes
  const countNoneAvailableBornes = useCallback(
(available_bornesArray: boolean[], booleanType: boolean): number => {
      const count = available_bornesArray.filter(
        (borne) => Boolean(borne) === booleanType, 
      ).length;
      return count;
    },
    [],
  );

  const isAvailable = useCallback(
    (available_bornesArray: boolean[]): boolean => {
      const resultNoneAvailable = countNoneAvailableBornes(available_bornesArray, false); 

      if (resultNoneAvailable === available_bornesArray.length) return false; //"🔴 Non Disponible";

      return true; //"🟢 Disponible";
    },
    [countNoneAvailableBornes],
  );

  //--- This  functions  if there is available bornes --- END

  
  const handleClickReservation = async () => {

    try {
    
      ApiCall.current = new PutBookABorne(auth?.token as string, logout, navigate, setAuth);
      ApiCall.current.sendRequest({id_station: coordinatesOfCurrentStation?.id})

    } catch (error) {
      console.error("Error reserving :", error);
    }
  };

  
  useEffect(() => {
    if (coordinatesOfCurrentStation) {
      const { available_bornes } = coordinatesOfCurrentStation;

      const checkIfOneBorneRemainAtLeast = isAvailable(available_bornes); //true by default

      if (checkIfOneBorneRemainAtLeast) setAvailable(true);
      else setAvailable(false);
    }
  }, [coordinatesOfCurrentStation, isAvailable]);

  return (
    <>
      {coordinatesOfCurrentStation ? (
        <section className="banner">
          <img src={Wire} alt="Wire logo" className="WireImage" />

          {available ? <p> Réserver</p> : <p> Non Disponible</p>}

          <label
            className="switch"
            style={{ display: available ? "block" : "none" }}
          >
            <input type="checkbox" />
            <span className="sliderRound" />
          </label>

          <button
            className="ButtonReserv"
            type="submit"
            onClick={handleClickReservation}
            disabled={!available}
            style={{ display: available ? "block" : "none" }}
          >
            Valider
          </button>
        </section>
      ) : null}
    </>
  );
}

export default banner;
