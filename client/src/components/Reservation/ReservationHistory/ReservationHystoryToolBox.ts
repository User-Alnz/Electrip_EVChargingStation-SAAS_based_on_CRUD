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

export default transformIsoToUIRequiredFormat;