import EVBooking from "/EVBooking.png";
import ReservationDisplayProgressionBar from "../ReservationProgressionBar/ReservationDisplayProgressionBar";
import { Auth, useAuth } from "../../../contexts/AuthContext";
import AuthApi from "../../../api/AuthApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { transformIsoTo24HoursFormat, OutputRemainingTimeReservation } from "./ReservationStationToolBox";
import ChargingAnimation from "../ReservationAnimation/ReservationAnimation"


type ReservationData = {
    id : number,
    borne_id:   number, //7869,
    status : "used" | "cancelled" | "reserved",
    start_time:  string, //2025-05-26T16:27:17.000Z,
    start_using: string | null, //  2025-06-16T08:47:31.000Z, | null,
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

type Option = 'cancelled'| 'used'; 


function ReservationStationDuration(reservationProps : ReservationData)
{
    const { auth, logout, setAuth } = useAuth();
    const navigate = useNavigate();

        const UpdateReservation = async( action : Option) => {
            try
            {
                let response;
                
                response = await fetch(
                `${import.meta.env.VITE_API_URL}/updateBooking`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${auth?.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        reservation_id : reservationProps.id,
                        status : action 
                    })
                }
                );

                if(response.status == 403){
          
                    const AuthToken : boolean | Auth = await AuthApi.tryRefreshToken();
          
                    if(AuthToken && typeof(AuthToken) !== "boolean"  && "token" in AuthToken) // there is one thing to enhance here 
                    {  
                      sessionStorage.setItem("user", JSON.stringify(AuthToken));
                      setAuth(AuthToken);
          
                      response = await fetch(
                        `${import.meta.env.VITE_API_URL}/updateBooking`,
                        {
                          method: 'PUT',
                          headers: {
                            'Authorization': `Bearer ${AuthToken?.token}`,
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            reservation_id : reservationProps.id,
                            status : action 
                        })

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

                if(action === "cancelled" && response.ok)
                toast.success("Votre reservation a été annulée avec succès.");
                else if(action === "cancelled" && !response.ok)
                toast.error("impossible d'annuler votre reservation");

                if(action === "used" && response.ok)
                toast.success("Vous pouvez brancher votre voiture.");
                else if(action === "used" && !response.ok)
                toast.error("Une erreur est survenue");


            }
            catch(err)
            {
                console.error("Error fetching location or data:", err);
            }
        }


    return(
        <>
        {reservationProps ? (
        <section className="ReservationCard">

            <div className="ReservationBoxDuration">
                
                <div className="ReservationBoxDurationTitleBox">
                    <img src={EVBooking} alt="" />
                    <p className="ReservationBoxTitle">Ma reservation</p>
                </div>

                <ReservationDisplayProgressionBar end_time = {reservationProps.end_time}/>

                <div className="wrapReservationBox">

                    <div className="WrapReservationBoxDurationInfo">   

                        <div className="MainWraperReservationDuration">

                            <div className="WrapReservationDuration">
                                <p>Debut :</p> 
                                <p className="displayTimeBegin">{reservationProps?.start_time && transformIsoTo24HoursFormat(reservationProps.start_time)}</p>
                            </div>

                            <div className="WrapReservationDuration">
                                <p>Fin :</p>  <p className="displayTimeEnd">{reservationProps?.end_time && transformIsoTo24HoursFormat(reservationProps.end_time)}</p>
                            </div>
                            
                        </div>

                        <div className="MainWraperReservationDuration">
                            <div className="WrapReservationDuration">
                                <p>Restant :</p> <p className="displayTimeEnd">{reservationProps?.end_time && OutputRemainingTimeReservation(reservationProps.end_time)}</p>
                            </div>
                        </div>

                    </div>
                    {reservationProps.status === "used" ?  
                    (
                        <ChargingAnimation reservation={reservationProps} />
                    ):(
                        <div>                        
                            <button className="ReservationBoxButton" onClick={() => {UpdateReservation('cancelled')}}>Annuler ma reservation</button>
                            <button className="ReservationBoxButton" onClick={() => {UpdateReservation('used')}}> Brancher ma voiture</button>
                        </div>
                    )}

                </div>
            </div>

        </section>
        ) : ( <p>Aucune réservation en cours</p>)}
        </>
    );

}

export default ReservationStationDuration;