import {useCallback, useState, useEffect, useMemo, useRef } from "react";
import {setDataInCache, getDataInCache} from "../../../util/CachingData";
import {returnTotal, priceKwh, TotalCost, WorkoutDistance, timeInCharge, batteryAnimation} from "./ReservationAnimationToolbox"
import "./ReservationAnimation.css"


type ReservationData = {

    id : number,
    borne_id:   number, //7869,
    status : "used" | "cancelled" | "reserved",
    start_time:  string, //2025-05-26T16:27:17.000Z,
    start_using: string | null, //  2025-06-16T08:47:31.000Z,
    end_time: string, //2025-05-26T17:27:17.000Z,
    id_station: string, //'FRCPIE6506905',
    n_station: string, //'station name',
    ad_station: string, //'adress',
    nbre_pdc: number, //1,
    acces_recharge:  string | null,
    accessibilite: string,//'Lun-Vend 7AM à 8PM\nSam 7AM à 12PM',
    puiss_max: string, //'24',
    type_prise: string, //'Combo'

};

type ChargingAnimationProps = {
    reservation : ReservationData
}

function ChargingAnimation({reservation} : ChargingAnimationProps)
{
    //This state rely on cache data to keep persistante data over refreshing pages, moving to new page etc.. 
    const [KwhPrice] = useState<number>(()=> {
        
        const key = `ReservationOnId-${reservation.id}`;

        const dataFromChache = getDataInCache(key);

        if(dataFromChache !== null) 
        return dataFromChache;

        const value =  priceKwh(reservation.puiss_max);
        const expiry = new Date(reservation.end_time).getTime();
        setDataInCache(key, value, expiry);
        
        return value;
    });
    
    const maxKwhCapacity = useRef(200);
    const [KwhConsumption, setKwhConsumption] = useState<number>(1);
    
    //This overwrite previous instance of Date() and update time on each instancition. 
    //avoid creating new class and keep control over garbage collector and avoid relying on it.
    //Immediat free and rewrite state by new class.
    const [now, setNow] = useState(new Date());
    
   
    const endTime = useMemo(() => {  //this avoid creating new Date instance on component rerendering;

        let Time = new Date(reservation.end_time);
        return Time.getTime();

    }, [reservation.end_time]); //create new instance only if reservation.end_time change. 


    //This create loop to rerender components on each second
    useEffect(() => {
        const interval = setInterval(() => {
            
            //initiate value in loop 
            const TotalLoaded = returnTotal(reservation.start_using as string, reservation.puiss_max, "loaded") as number;
            setKwhConsumption(TotalLoaded);

            if(now.getTime() >= endTime || KwhConsumption >= maxKwhCapacity.current)
            clearInterval(interval);
            else
            setNow(new Date());

        }, 1000); //1000 ms = 1 second
    
        return () => clearInterval(interval); //Cleanup when component unmounts
    }, []);


    /****
     *     /!\ Important 
     *     Wrapp all functions on usecallback to avoid creating useless instance and only refer to always same function 
     *     Dependency Array is free there because <ChargingAnimation/> just rerender itself in static parent component sharing its data 
     *     from http call already done. So just need to memoize functions from usecallback to save perf & memory used by browser.  
     * 
     *      + all usecallback have empty arrays becasue inputs reservation do not change on each function evocation. Just the output !
     ****/

    const displayTotalPercentage = useCallback((): JSX.Element => {
        
       return  returnTotal(reservation.start_using as string, reservation.puiss_max, "%") as JSX.Element;
    }, []); 

    const displayKwhLoaded = useCallback(() : JSX.Element => {

        return returnTotal(reservation.start_using as string, reservation.puiss_max, "Kwh") as JSX.Element;
    }, []);

    const displayCost = useCallback(() : JSX.Element => {

        return TotalCost(reservation.start_using as string, KwhPrice, reservation.puiss_max) as JSX.Element;
    },[]);

    const displayDistance = useCallback((KwhConsumption : number) : JSX.Element  => {

        return WorkoutDistance(KwhConsumption) as JSX.Element;
    },[]);

    const displayTimeInUse = useCallback(() : JSX.Element => {

        return timeInCharge(reservation.start_using as string) as JSX.Element;
    },[]);

    const runAnimation = useCallback(() : JSX.Element=>{

        return batteryAnimation(reservation.start_using as string, reservation.puiss_max) as JSX.Element;
    },[]);
  

    return(

        <div className="ChargingMainWrapper">
            
            <div className="ChargingMenuTitle">

                <div>
                    {displayTotalPercentage()}

                    <div className="ChargingMaxCapacity">
                        <p>Maximum</p> 
                        <p>{maxKwhCapacity.current}kw</p>
                    </div>
                    
                </div>
               

                <div>
                    <p>{`${KwhPrice}€`}</p>
                    {displayCost()}
                </div> 
            </div>

            {runAnimation()}

            <div className="ChargingMenuInfo">
                {displayKwhLoaded()}
                {displayDistance(KwhConsumption)}
                {displayTimeInUse()}
            </div>

        </div>
    );
}

export default ChargingAnimation;