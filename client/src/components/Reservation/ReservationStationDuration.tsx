import EVBooking from "/EVBooking.png";
import ReservationDisplayProgressionBar from "./ReservationDisplayProgressionBar";

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

function transformIsoTo24HoursFormat(dateIsoFormat:string) : string
{

    if (!dateIsoFormat)
    return "--:--";

    const hoursFormat = new Date(dateIsoFormat);

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
    return hoursFormat.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function OutputRemainingTimeReservation( end_time_dateIsoFormat : string) : string
{
    let delta; 

    const start_time = new Date();
    const end_time = new Date(end_time_dateIsoFormat);

    delta = end_time.getTime() - start_time.getTime(); // delta in millisecond
    delta = Math.floor(delta / 60000); //convet milisecond to minutes
    delta = delta % 60; //find out remaning time out of one hour

    return `${delta} min`;
}



function ReservationStationDuration(reservationProps : ReservationData)
{

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

                    <div>
                        <button className="ReservationBoxButton">Annuler ma reservation</button>
                        <button className="ReservationBoxButton">Brancher ma voiture</button>
                    </div>

                </div>
            </div>

        </section>
        ) : ( <p>Aucune réservation en cours</p>)}
        </>
    );

}

export default ReservationStationDuration;