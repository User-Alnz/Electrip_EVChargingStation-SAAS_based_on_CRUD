import Nav from "../components/Nav/Nav";
import "./Reservation.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth, useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import ReservationStationInfo from "../components/Reservation/ReservationStationInfo";
import ReservationStationDuration from "../components/Reservation/ReservationStationDuration";
import AuthApi from "../api/AuthApi";


type ReservationData = {
    borne_id:   number, //7869,
    start_time:  string, //2025-05-26T16:27:17.000Z,
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
    const [reservation, setReservation] = useState<ReservationData[]>([]);
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
  
            if(AuthToken && typeof(AuthToken) !== "boolean"  && "token" in AuthToken) // there is one thing to enhance here 
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
          //console.log(data[0]);
          setReservation(data);
         
        }
        catch(err){
            console.error("Error fetching location or data:", err);
        }
    }
    
    getReservation();

    },[]);

  
    return(
        <>
            <nav>
                <Nav />
            </nav>

            <main className="ReservationWrapper">

                <div className="ReservationMenu">

                    <h1 className="ReservationTitles">En cours</h1>
                    <h1 className="ReservationTitles">Historique</h1>

                </div>
                                
               <ReservationStationInfo {...reservation[0]} />
               <ReservationStationDuration {...reservation[0]}/>

            </main>
        </>
    )


}

export default Reservation;