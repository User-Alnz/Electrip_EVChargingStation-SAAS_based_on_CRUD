import Nav from "../components/Nav/Nav";
import borne from "/Borne_recharge_illustration.png";
import wire from "/WireStation.png"
import EVStation from "/EVStation.png"
import EVBooking from "/EVBooking.png"
import "./Reservation.css"

function Reservation()
{

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
                
                <section className="ReservationCard">

                    <div className="ReservationBoxStation" >
                        <img src={borne} alt="" />
                    </div>

                    <div className="ReservationBoxStationInfo">

                        <p className="ReservationBoxTitle">ABVV Volvo St Ouen l'Aumône </p>
                        <p className="ReservationStationAdress">135 Rue de Paris 95310 Saint-Ouen-l'Aumône</p>

                        <div className="ReservationBoxStationDetail">

                            <img src={EVStation} alt="" />

                            <div>
                                <p className="ReservationBoxStationDetailTitle">Nombre de place</p>
                                <p>1</p>

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
                                <p>T2</p>

                                <p className="ReservationBoxWireTitle">Puissance Max</p>
                                <p>20 KW</p>
                            </div>
                        
                            <img src={wire} alt="" />

                        </div>
                    </div>
                </section>

                <section className="ReservationCard">

                    <div className="ReservationBoxDuration">
                        
                        <div className="ReservationBoxDurationTitleBox">
                            <img src={EVBooking} alt="" />
                            <p className="ReservationBoxTitle">Ma reservation</p>
                        </div>

                        <div></div>

                        <div className="wrapReservationBox">

                            <div className="WrapReservationBoxDurationInfo">   

                                <div className="MainWraperReservationDuration">

                                    <div className="WrapReservationDuration">
                                        <p>Debut :</p> 
                                        <p className="displayTimeBegin">16 : 07</p>
                                    </div>

                                    <div className="WrapReservationDuration">
                                        <p>Fin :</p>  <p className="displayTimeEnd">17 : 07</p>
                                    </div>
                                    
                                </div>

                                <div className="MainWraperReservationDuration">
                                    <div className="WrapReservationDuration">
                                        <p>Restant :</p> <p className="displayTimeEnd">30 min</p>
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
                
                

            </main>
        </>
    )


}

export default Reservation;