function transformIsoToUIRequiredFormat(dateIsoFormat:string) : string
{
    let newDateFormat = ""; // 2 juin 2025 | 20:43 .  Day Month Year | hours:minutes. 
    
    if (!dateIsoFormat)
    return "--:--";

    const hoursFormat = new Date(dateIsoFormat);

    newDateFormat += hoursFormat.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    newDateFormat += " | "

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
    newDateFormat += hoursFormat.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return  newDateFormat;
}

function interpretReservationStatus( status: "used" | "cancelled" | "reserved" ) : string
{
    if(status === "used")
    return "Utilisé";

    if(status === "reserved")
    return "Reservé";

    if(status === "cancelled")
    return "Annulé";

    return "N/A";
}

function defineBorderBoxStyle( status: "used" | "cancelled" | "reserved" ) : React.CSSProperties
{
    if(status === "used")
    return  { borderLeft: "4px solid green" };

    if(status === "cancelled")
    return   { borderLeft: "4px solid red" }; 

    return { borderLeft: "4px solid #00aadc" };//{ border-left: "4px solid #00aadc"};
}
export {transformIsoToUIRequiredFormat, interpretReservationStatus, defineBorderBoxStyle};