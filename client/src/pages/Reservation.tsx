import Nav from "../components/Nav/Nav";
import "./Reservation.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth, useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import Loader from "../components/Loader/Loader";
import {delay} from "../util/GenerateDelay";
import {GenRerender} from "../util/TriggerRerender";
import {useSelectedView} from "../contexts/ReservationContext"
import NoReservationUnderway from "../components/Reservation/NoReservationReturned/NoReservationUnderway";
import ReservationStationInfo from "../components/Reservation/ReservationUnderway/ReservationStationInfo";
import ReservationStationDuration from "../components/Reservation/ReservationUnderway/ReservationStationDuration";
import ReservationHistory from "../components/Reservation/ReservationHistory/ReservationHistory";
import AuthApi from "../api/AuthApi";


type ReservationData = {
    id : number,
    borne_id:   number, //7869,
    status : "used" | "cancelled" | "reserved",
    start_time:  string, //2025-05-26T16:27:17.000Z,
    start_using: string | null, //  2025-06-16T08:47:31.000Z, | null 
    end_time: string, //2025-05-26T17:27:17.000Z,
    id_station: string, //'FRCPIE6506905',
    n_station: string, //'station name',
    ad_station: string, //'adress',
    nbre_pdc: number, //1,
    acces_recharge:  string | null,
    accessibilite: string,//'Lun-Vend 7AM à 8PM\nSam 7AM à 12PM',
    puiss_max: string, //'24',
    type_prise: string, //'Combo'
};

function Reservation()
{
   // this is for handle rerendering 
    const [triggerRerender, setTriggerRerender ] = useState<boolean>(false);
    const  staticRerenderLogic = useRef(new GenRerender(setTriggerRerender));

    const [reservation, setReservation] = useState<ReservationData[]>([]);
    const [isReservationLoaded, setIsReservationLoaded ] = useState<boolean>(false);
    const {selectedView, setSelectedView} = useSelectedView();
    const LoaderSpec = { height: "200px", paddingTop: "80px" }; // to be used by <Loader/> in jsx returned
    const { auth, logout, setAuth } = useAuth();
    const navigate = useNavigate(); //use redirection

    useEffect(() => {

    const getReservation = async () => {
            
        try{
            let  data;
            let response;

            response = await fetch(
            `${import.meta.env.VITE_API_URL}/booking/`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${auth?.token}`,
                'Content-Type': 'application/json',
              },
            });

          if(response.status == 403){
          
            const AuthToken : boolean | Auth = await AuthApi.tryRefreshToken();
  
            if(AuthToken && typeof(AuthToken) !== "boolean"  && "token" in AuthToken)
            {  
              sessionStorage.setItem("user", JSON.stringify(AuthToken));
              setAuth(AuthToken);
  

              response = await fetch(
                `${import.meta.env.VITE_API_URL}/booking/`,
                {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${AuthToken?.token}`,
                    'Content-Type': 'application/json',
                  },
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

          data = await response.json();
          
          await delay(3000); //from /util directory

          setReservation(data);
          setIsReservationLoaded(true);
        }
        catch(err){
            console.error("Error fetching location or data:", err);
        }
    }
    
    getReservation();

    },[triggerRerender]);

  
    return(
        <>
            <nav>
                <Nav />
            </nav>

            <main className="ReservationWrapper">

                <div className="ReservationMenu">

                    <h1 className={`ReservationTitles ${selectedView === "ongoing" ? "active" : ""}`} onClick={() => setSelectedView("ongoing")}>En cours</h1>
                    <h1 className={`ReservationTitles ${selectedView === "history" ? "active" : ""}`} onClick={() => setSelectedView("history")}>Historique</h1>

                </div>

                {selectedView === "ongoing" ? (
                  
                  !isReservationLoaded ? (<Loader style={LoaderSpec}/>) :
                    reservation.length < 1 ? (<NoReservationUnderway MessageToDisplay="Pas de reservation en cours" />) :
                    (
                      <>
                        <ReservationStationInfo {...reservation[0]} />
                        <ReservationStationDuration reservationProps={reservation[0]} rerenderer={staticRerenderLogic.current} />
                      </>
                  )

                ):( 

                  <ReservationHistory/>

                )}



            </main>
        </>
    )


}

export default Reservation;