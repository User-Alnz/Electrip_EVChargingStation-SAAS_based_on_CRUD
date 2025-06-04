import "./ReservationDisplayProgressionBar.css";

type ProgressionBarProps = { 
    end_time : string;
};

function diplayProgression(end_time :string) : JSX.Element 
{
    let delta;
    
    const TimeNow = new Date();
    const end_TimeReservation = new Date(end_time);

    delta = end_TimeReservation.getTime() - TimeNow.getTime(); // delta in millisecond
    delta = Math.floor(delta / 60000); //convet milisecond to minutes
   
    const divWidth = Math.round(((60 - delta )/ 60 )*100) //percentage = (minutesPassed / totalMinutes) * 100;
  
    return(<div className="ReservationProgressionBar" style={ { width : `${divWidth}%` } }></div>);
}

function ReservationDisplayProgressionBar({end_time} : ProgressionBarProps) : JSX.Element
{ //endtime is isoFormat date

    return(
        <div>
            <div className="WrapperReservationProgressionBar">
            {diplayProgression(end_time)}
            </div>
        </div>
    )
}

export default ReservationDisplayProgressionBar;
