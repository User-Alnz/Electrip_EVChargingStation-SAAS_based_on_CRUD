import LeafletIconsRegister from "./markerIconsOnmap.ts";

//this function parse available_bornes from fetch to define which icone to use form LeafletIconsRegister.
function defineWhichIconToPick(available_bornes: boolean[]) 
{
    const count = available_bornes.filter((borne) => borne).length; // get only if 1 || True

    if (available_bornes.length === count) 
      return LeafletIconsRegister.stationLocationBlue;
    

    if (count === 0)
      return LeafletIconsRegister.stationLocationRed;
    

    if (count <= available_bornes.length / 2)
      return LeafletIconsRegister.stationLocationYellow;
    
    // return a default icon if any condition is met. to prevent component to break while running.
    return LeafletIconsRegister.stationLocationBlue;
}

export {defineWhichIconToPick};