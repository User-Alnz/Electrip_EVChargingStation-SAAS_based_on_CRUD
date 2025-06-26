function  returnTotal(start_using: string, puiss_max: string, option : "Kwh" | "%" | "loaded") : JSX.Element | number
{
    let consumption;
    const maxKWh = 200;

    const power_Kwh = parseInt(puiss_max);
    const start = new Date(start_using);
    const TimeNow = new Date();

    consumption =  Math.floor(TimeNow.getTime() - start.getTime())/6000; //Convert to mintues
    consumption = (power_Kwh / 60) * consumption;

    if(option === "loaded")
    {
        consumption = Number(consumption.toFixed(2));
        return consumption;
    }

    if(option === "Kwh")
    {
        consumption = Number(consumption.toFixed(2));
        return (
            <p>{`${consumption} Kwh`}</p>
        );
        
    }

    if(option ==="%")
    {
        consumption = (consumption/maxKWh)*100;
        consumption = Math.round(consumption);

        if(consumption > 100)
        consumption = 100;

        return(<p style={{  
                    fontWeight: 700,
                    fontSize: "x-large",
                    alignSelf: "center"}}>
                
                    {`${consumption} %`}

                </p>);

    }

    return(<></>); //Default return
    
}

function priceKwh(puiss_max: string) : number
{

    const power_Kwh = parseInt(puiss_max);
    let kwhPrice = 0; 

    if(power_Kwh <= 5)
        kwhPrice = Number((Math.random() * (0.25 - 0.15) + 0.15).toFixed(2));

    if(power_Kwh > 5 && power_Kwh <= 22 )
        kwhPrice = Number((Math.random()* (0.35 - 0.22 ) + 0.22).toFixed(2));
    
    if(power_Kwh  > 22 && power_Kwh <= 50)
        kwhPrice = Number((Math.random()* (0.50 - 0.35 ) + 0.35).toFixed(2));
    
    if(power_Kwh > 50 && power_Kwh <= 100 )
        kwhPrice = Number((Math.random()* (0.60 - 0.50 ) + 0.50).toFixed(2));
    
    if(power_Kwh > 100)
        kwhPrice = Number((Math.random()* (0.70 - 0.55 ) + 0.55).toFixed(2));
    
    return kwhPrice;
    
}

function TotalCost(start_using : string, KwhPrice : number, puiss_max: string) : JSX.Element
{
    let consumption;
    const power_Kwh = parseInt(puiss_max);
    const start = new Date(start_using);
    const TimeNow = new Date();

    consumption =  Math.floor(TimeNow.getTime() - start.getTime())/6000; //Convert to mintues
    consumption = (power_Kwh / 60) * consumption;
    consumption = Number(consumption.toFixed(2));
    consumption = Number((consumption * KwhPrice).toFixed(2));

    return (<p>{`${consumption}`}€</p>);
}

function WorkoutDistance( KwhConsumption : number) : JSX.Element
{
    const averageConsumption = 100/15; //100 km / 15 kWh = 6.67 km/kwh
    const distance = Number((averageConsumption * KwhConsumption).toFixed(2));

    return (<p>{`+ ${distance}km `}</p>);
}

function timeInCharge(start_using:string) : JSX.Element
{
    let timeInUse;
    const start = new Date(start_using);
    const TimeNow = new Date();

    timeInUse = Math.floor(TimeNow.getTime() - start.getTime())/60000; // convert miliseconds to minutes
    timeInUse = Math.round(timeInUse);
    
    return(<p>{`${timeInUse}`} min</p>)
}

function batteryAnimation(start_using: string, puiss_max: string) : JSX.Element
{
    let consumptionPercentage;
    let fromThisPercentage;
    const maxKWh = 200;

    const power_Kwh = parseInt(puiss_max);
    const start = new Date(start_using);
    const TimeNow = new Date();

    consumptionPercentage =  Math.floor(TimeNow.getTime() - start.getTime())/6000; //Convert to mintues
    consumptionPercentage = (power_Kwh / 60) * consumptionPercentage;
    consumptionPercentage = (consumptionPercentage/maxKWh)*100;
    consumptionPercentage = Number(consumptionPercentage.toFixed(2));

    fromThisPercentage = consumptionPercentage - 5;

    if(consumptionPercentage < 100)
    return(
        <div className="battery"> 
            <div className="batteryOnload" style={{ 
                '--from' : `${fromThisPercentage}%`,
                '--consumption': `${consumptionPercentage}%` } as React.CSSProperties }>
            </div>
        </div>);

    return(
        <div className="battery"> 
            <div className="batteryOnloadDone"></div>
        </div>);


}

export {returnTotal, priceKwh, TotalCost, WorkoutDistance, timeInCharge, batteryAnimation};