import Wire from "/mini_icone_borne.png";
import "./banner.css";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCoordinates } from "../../contexts/EVStationContext.tsx";
import { Auth, useAuth } from "../../contexts/AuthContext.tsx";
import AuthApi from "../../api/AuthApi.tsx";
import { useNavigate } from "react-router-dom";

function banner() {

  const { coordinatesOfCurrentStation } = useCoordinates();
  const [available, setAvailable] = useState(false);

  //Used in Useeffect => to secure fetch 
  const { auth, logout, setAuth } = useAuth();
  const navigate = useNavigate();


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
     
      let response;

      response = await fetch(`${import.meta.env.VITE_API_URL}/bookAborn`, 
      {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${auth?.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_station: coordinatesOfCurrentStation?.id,
        }),
      });

      if(response.status == 403){
          
        const AuthToken : boolean | Auth = await AuthApi.tryRefreshToken();

        if(AuthToken && typeof(AuthToken) !== "boolean"  && "token" in AuthToken) // there is one thing to enhance here 
        { 

          sessionStorage.setItem("user", JSON.stringify(AuthToken));
          setAuth(AuthToken);

          response = await fetch(`${import.meta.env.VITE_API_URL}/bookAborn`, 
          {
            method: "PUT",
            headers: {
              'Authorization': `Bearer ${AuthToken?.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id_station: coordinatesOfCurrentStation?.id,
            }),
          });

        }
        else{
          logout();
          navigate("/");
          toast.error("Votre session a expirée. Merci de vous reconnecter");
        }
      }

      if(response.status == 406 || response.status == 401){
        logout();
        navigate("/");
        toast.error("Votre session a expirée. Merci de vous reconnecter");
      }

      if (response.status === 200)
        toast.success("Votre borne a bien été réservée ! 😊");

      if(response.status === 409)
        toast.error("Toutes les bornes de la station sont déjà réservées.");
      
      if(response.status === 422)
        toast.warn("Vous avez déjà une reservation en cours");

        

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
