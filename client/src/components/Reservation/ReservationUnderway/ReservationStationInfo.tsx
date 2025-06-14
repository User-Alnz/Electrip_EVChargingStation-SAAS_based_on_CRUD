import borne from "/Borne_recharge_illustration.png";
import wire from "/WireStation.png";
import EVStation from "/EVStation.png";

type ReservationData = {
    id : number,
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

function ReservationStationInfo(reservationProps : ReservationData)
{
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

                                    <div className="ReservationBoxAvaibility"><span className="greenSpot"></span><p>1</p><span className="redSpot"></span><p>0</p></div>

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