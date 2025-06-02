import NodataIcon from "/Nodata.png";

function NoReservationUnderway()
{
    return(
        <>
            <div className="WrapNoDataReservation">
                <img src={NodataIcon} alt="" />
                <h1 className="ReservationTitles">Pas de reservation en cours</h1>
            </div>
        </>
    );
}

export default NoReservationUnderway;