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

export {transformIsoTo24HoursFormat, OutputRemainingTimeReservation}