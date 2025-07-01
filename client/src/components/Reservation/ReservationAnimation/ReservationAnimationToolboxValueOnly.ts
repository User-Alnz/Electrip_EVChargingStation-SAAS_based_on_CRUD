function  finalConsumption( start_using : string, end_time : string, puiss_max: string,  maxKwhCapacity : number ) : number
{
    let consumption;
    
    const power_Kwh = parseInt(puiss_max);
    const start = new Date(start_using).getTime();
    const end = new Date(end_time).getTime();

    const delta = end - start;
    const ratioToOneHour =  delta / (1000 * 60 * 60); //milisecond compared to one hour

    consumption = power_Kwh * ratioToOneHour;
    consumption = Number(consumption.toFixed(2));

    if(consumption > maxKwhCapacity)
    return maxKwhCapacity;

    return consumption;
}

function finalPrice(start_using : string, end_time : string, KwhPrice : number, puiss_max: string, maxKwhCapacity : number ) : number
{
    let consumption;

    const power_Kwh = parseInt(puiss_max);
    const start = new Date(start_using).getTime();
    const end = new Date(end_time).getTime();

    const delta = end - start;
    const ratioToOneHour =  delta / (1000 * 60 * 60); //milisecond compared to one hour

    consumption = power_Kwh * ratioToOneHour;
    consumption = Number(consumption.toFixed(2));

    if(consumption > maxKwhCapacity)
    return Number((maxKwhCapacity * KwhPrice).toFixed(2));

    consumption = Number((consumption * KwhPrice).toFixed(2));

    return consumption;
}

function finalTimeInCharge(start_using : string, end_time : string, puiss_max : string, maxKwhCapacity : number ) : number
{
    let timeInUse;
    let ratioTimeInUseToCompare;

    const power_Kwh = parseInt(puiss_max);
    const start = new Date(start_using).getTime();
    const end = new Date(end_time).getTime();

    timeInUse = Math.floor((end - start)/ 60000); //milisecond to minutes

    ratioTimeInUseToCompare = Math.round((maxKwhCapacity / power_Kwh) * 60);

    if(ratioTimeInUseToCompare < timeInUse)
    return ratioTimeInUseToCompare;

    return timeInUse;
}

function finalDistance(start_using : string, end_time : string, puiss_max : string, maxKwhCapacity : number) : number
{
    let consumption;
    let distance;
    
    const averageConsumption = 100/15; //100 km / 15 kWh = 6.67 km/kwh
    
    const power_Kwh = parseInt(puiss_max);
    const start = new Date(start_using).getTime();
    const end = new Date(end_time).getTime();

    const delta = end - start;
    const ratioToOneHour =  delta / (1000 * 60 * 60);
    consumption = power_Kwh * ratioToOneHour;
    consumption = Number(consumption.toFixed(2));

    if(consumption > maxKwhCapacity)
    return distance = Number((averageConsumption * maxKwhCapacity).toFixed(2)); 
    
    distance = Number((averageConsumption * consumption).toFixed(2));

    return distance;
}

export {finalConsumption, finalPrice, finalTimeInCharge, finalDistance};