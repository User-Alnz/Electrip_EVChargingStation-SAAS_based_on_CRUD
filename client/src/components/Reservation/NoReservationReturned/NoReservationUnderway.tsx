import NodataIcon from "/Nodata.png";

type NoReservationUnderwayProps = {
    MessageToDisplay : string;
}


function NoReservationUnderway( {MessageToDisplay} : NoReservationUnderwayProps )
{
    return(
        <>
            <div className="WrapNoDataReservation">
                <img src={NodataIcon} alt="" />
                <h1 className="ReservationTitles">{MessageToDisplay}</h1>
                
            </div>
        </>
    );
}

export default NoReservationUnderway;