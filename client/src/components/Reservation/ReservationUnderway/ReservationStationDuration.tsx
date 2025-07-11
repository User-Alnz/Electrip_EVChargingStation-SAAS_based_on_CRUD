import EVBooking from "/EVBooking.png";
import ReservationDisplayProgressionBar from "../ReservationProgressionBar/ReservationDisplayProgressionBar";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { transformIsoTo24HoursFormat, OutputRemainingTimeReservation } from "./ReservationStationToolBox";
import { GenRerender } from "../../../util/TriggerRerender";
import ChargingAnimation from "../ReservationAnimation/ReservationAnimation"
import { useRef } from "react";
import PutUpdateBooking from "../../../api/PutUpdateBooking";


interface ReservationStationDurationProps 
{
    reservationProps: ReservationData;
    rerenderer: GenRerender<boolean>;
}

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


function ReservationStationDuration({reservationProps, rerenderer} : ReservationStationDurationProps)
{
    const { auth, logout, setAuth } = useAuth();
    const navigate = useNavigate();
    const  callAPI = useRef<PutUpdateBooking|null>(null);

        const UpdateReservation = async( action : Option) => {
            try
            {
                let response;
                
                callAPI.current = new PutUpdateBooking(auth?.token as string, logout, navigate, setAuth);
                
                response = await callAPI.current.sendRequest({
                    reservation_id : reservationProps.id,
                    status : action
                });

                if(action === "cancelled" && response.ok)
                toast.success("Votre reservation a été annulée avec succès.");
                else if(action === "cancelled" && !response.ok)
                toast.error("impossible d'annuler votre reservation");

                if(action === "used" && response.ok)
                toast.success("Vous pouvez brancher votre voiture.");
                else if(action === "used" && !response.ok)
                toast.error("Une erreur est survenue");

                //This is responsible for rerendering parent Component to update User interface based on button action
                // this then does launch ChargingAnimation or return Component NoReservationUnderway because reservation got cancelled
                rerenderer.TriggerRerender();

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

                <div className="wrapReservationBox" style={reservationProps.status === "used" ? { flexDirection: "column" } : {}}>

                    <div style={{ alignSelf: reservationProps.status === "used" ? 'center' : 'null'}}>
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

                        <ReservationDisplayProgressionBar end_time = {reservationProps.end_time}/>
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