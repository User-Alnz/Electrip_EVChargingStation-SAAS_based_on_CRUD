import borne from "/Borne_recharge_illustration.png";
import wire from "/WireStation.png";
import EVStation from "/EVStation.png";

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
    available : boolean [];
};

function ReservationStationInfo(reservationProps : ReservationData)
{
    function countAvailableBornes(available_bornesArray: boolean[],booleanType: boolean): number 
    {
        const count = available_bornesArray.filter((borne) => Boolean(borne) === booleanType).length;
        return count;
    }

    function listOfAvailableBornes(available_bornesArray: boolean[]): JSX.Element 
    {
        const borneNotAvailable = countAvailableBornes(available_bornesArray, false);
        const borneAvailable = countAvailableBornes(available_bornesArray, true);
      
        return (
          <div>
            <span className="greenSpot" /> <b>{borneAvailable}</b>{" "}
            <span className="redSpot" /> <b>{borneNotAvailable}</b>
          </div>
        );
    }

    return(
                
        <section className="ReservationCard">

                    <div className="ReservationBoxStation" >
                        <img src={borne} alt="" />
                    </div>

                    <div className="WrapStationAndBox">

                        <div className="ReservationBoxStationInfo">

                            <p className="ReservationBoxTitle">{reservationProps.n_station} </p>
                            <p className="ReservationStationAdress">{reservationProps.ad_station}</p>

                            <div className="ReservationBoxStationDetail">

                                <img src={EVStation} alt="" />

                                <div>
                                    <p className="ReservationBoxStationDetailTitle">Nombre de place</p>
                                    <p>{reservationProps.nbre_pdc}</p>

                                    <p className="ReservationBoxStationDetailTitle">Places encores disponibles</p>
                                    
                                    {listOfAvailableBornes(reservationProps.available)}

                                </div>

                            </div>
                        
                        </div>

                        <div className="ReservationBoxWire">

                            <p className="ReservationBoxTitle">Prise</p>
                            
                            <div className="ReservationBoxWireDetails" >
                                <div>
                                    <p className="ReservationBoxWireTitle">Type de prise</p>
                                    <p>{reservationProps.type_prise}</p>

                                    <p className="ReservationBoxWireTitle">Puissance Max</p>
                                    <p>{reservationProps.puiss_max} KW</p>
                                </div>
                            
                                <img src={wire} alt="" />

                            </div>
                        </div>

                    </div>

                </section>
    );

}

export default ReservationStationInfo;