import {useCallback, useState, useEffect, useMemo, useRef } from "react";
import {setDataInCache,setDataInCacheAsObject, getDataInCache} from "../../../util/CachingData";
import {returnTotal, priceKwh, TotalCost, WorkoutDistance, timeInCharge, batteryAnimation, loading} from "./ReservationAnimationToolbox";
import {finalConsumption, finalPrice, finalTimeInCharge, finalDistance} from "./ReservationAnimationToolboxValueOnly";
import UpdateReservation from "../../../api/UpdateReservation";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
//import { toast } from "react-toastify";
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

type FinalResultOfCharging = {
    totalCost : number,
    totalKWH : number,
    totalTimeInCharge : number,
    totalDistance : number,
    time : number
}

type ChargingAnimationProps = {
    reservation : ReservationData
}

function ChargingAnimation({reservation} : ChargingAnimationProps)
{

    const { auth, logout, setAuth } = useAuth();
    const navigate = useNavigate();
    const callAPI = useRef<UpdateReservation | null>(null);

    //This state rely on cache data to keep persistante data over refreshing pages, moving to new page etc.. 
    const [KwhPrice] = useState<number>(()=> {
        
        const key = `ReservationOnId-${reservation.id}`;

        const dataFromCache = getDataInCache(key);

        if(dataFromCache !== null) 
        return dataFromCache;

        const value =  priceKwh(reservation.puiss_max);
        const expiry = new Date(reservation.end_time).getTime();
        setDataInCache(key, value, expiry);
        
        return value;
    });

    const [finalDataCharging, setFinalDataCharging] = useState<FinalResultOfCharging>();
    const maxKwhCapacity = useRef(100);
    const [KwhConsumption, setKwhConsumption] = useState<number>(1);
    const [isCarLoaded, setIsCarLoaded] = useState<boolean>(false);
       
    const endTime = useMemo(() => {  //this avoid creating new Date instance on component rerendering;

        let Time = new Date(reservation.end_time);
        return Time.getTime();

    }, [reservation.end_time]); //create new instance only if reservation.end_time change. 


    //This create loop to rerender components on each second
    useEffect(() => {
        
        if(isCarLoaded) //This can be replaced to GET From database. || Caching for eaning time in developpemment Can be refacto later
        {
            const key = `RecapConsumption-${reservation.id}`;
            const dataFromCache = getDataInCache(key);

            if(dataFromCache !== null && typeof dataFromCache === "object") 
            setFinalDataCharging(dataFromCache);
        }

       

        if(!isCarLoaded)
        {
            callAPI.current = new UpdateReservation(auth?.token as string, logout, navigate, setAuth);

            const writeBodyRequest = async()=> {

                const BodyRequest = {
                    reservation_id : reservation.id,
                    totalCost : finalPrice(reservation.start_using as string, reservation.end_time, KwhPrice, reservation.puiss_max as string, maxKwhCapacity.current),
                    totalKWH : finalConsumption(reservation.start_using as string, reservation.end_time, reservation.puiss_max as string, maxKwhCapacity.current),
                    totalTimeInCharge : finalTimeInCharge(reservation.start_using as string, reservation.end_time, reservation.puiss_max as string, maxKwhCapacity.current),
                    totalDistance : finalDistance(reservation.start_using as string, reservation.end_time, reservation.puiss_max as string, maxKwhCapacity.current)
                };
                return BodyRequest;
            }

            const reachApi = async()=> {
                const bodyRequest = await writeBodyRequest();
                await callAPI.current?.sendRequest({bodyRequest});
            };

            reachApi();
        }

        
        if(!isCarLoaded)
        {
            const interval = setInterval(() => {
                
                //initiate value in loop 
                const TotalLoaded = returnTotal(reservation.start_using as string, reservation.puiss_max, maxKwhCapacity.current ,"loaded") as number;
                setKwhConsumption(TotalLoaded);
                
                if(Date.now() >= endTime || TotalLoaded >= maxKwhCapacity.current)
                {
                    setIsCarLoaded(true);
                    
                    const key = `RecapConsumption-${reservation.id}`;
                    
                    const finalDataChargingToCache = {
                        reservation_id : reservation.id,
                        totalCost : finalPrice(reservation.start_using as string, reservation.end_time, KwhPrice, reservation.puiss_max as string, maxKwhCapacity.current),
                        totalKWH : finalConsumption(reservation.start_using as string, reservation.end_time, reservation.puiss_max as string, maxKwhCapacity.current),
                        totalTimeInCharge : finalTimeInCharge(reservation.start_using as string, reservation.end_time, reservation.puiss_max as string, maxKwhCapacity.current),
                        totalDistance : finalDistance(reservation.start_using as string, reservation.end_time, reservation.puiss_max as string, maxKwhCapacity.current),
                        time : Date.now()
                    };

                    setFinalDataCharging(finalDataChargingToCache);

                    const dataFromCache = getDataInCache(key);

                    if(dataFromCache === null)
                    setDataInCacheAsObject(key, finalDataChargingToCache, new Date(reservation.end_time).getTime());

                    clearInterval(interval);
                }

            }, 1000); //1000 ms = 1 second
        
            return () => clearInterval(interval); //Cleanup when component unmounts
        }

    }, [isCarLoaded]);


    /****
     *     /!\ Important 
     *     Wrapp all functions on usecallback to avoid creating useless instance and only refer to always same function 
     *     Dependency Array is free there because <ChargingAnimation/> just rerender itself in static parent component sharing its data 
     *     from http call already done. So just need to memoize functions from usecallback to save perf & memory used by browser.  
     * 
     *      + all usecallback have empty arrays becasue inputs reservation do not change on each function evocation. Just the output !
     ****/

    const displayTotalPercentage = useCallback((): JSX.Element => {
        
       return  returnTotal(reservation.start_using as string, reservation.puiss_max, maxKwhCapacity.current, "%") as JSX.Element;
    }, []); 

    const displayKwhLoaded = useCallback(() : JSX.Element => {

        return returnTotal(reservation.start_using as string, reservation.puiss_max, maxKwhCapacity.current, "Kwh") as JSX.Element;
    }, []);

    const displayCost = useCallback(() : JSX.Element => {

        return TotalCost(reservation.start_using as string, KwhPrice, reservation.puiss_max) as JSX.Element;
    },[]);

    const displayDistance = useCallback((KwhConsumption : number) : JSX.Element  => {

        return WorkoutDistance(reservation.start_using as string, KwhConsumption) as JSX.Element;
    },[]);

    const displayTimeInUse = useCallback(() : JSX.Element => {

        return timeInCharge(reservation.start_using as string) as JSX.Element;
    },[]);

    const runAnimation = useCallback(() : JSX.Element=>{

        return batteryAnimation(reservation.start_using as string, reservation.puiss_max, maxKwhCapacity.current) as JSX.Element;
    },[]);

    return(

        <div className="ChargingMainWrapper">

            {isCarLoaded ?
            (<>
            
                <div className="ChargingMenuTitle">

                    <div>
                        {loading(reservation.start_using as string, finalDataCharging?.time ?? 0, reservation.puiss_max, maxKwhCapacity.current)}

                        <div className="ChargingMaxCapacity">
                            <p>Maximum</p> 
                            <p>{maxKwhCapacity.current}kw</p>
                        </div>
                        
                    </div>
               

                    <div>
                        <p>{`${KwhPrice}€`}</p>
                        {<p>{`${finalDataCharging?.totalCost ?? "--"}`}€</p>}
                    </div>
                </div>

                {loading(reservation.start_using as string, finalDataCharging?.time ?? 0, reservation.puiss_max, maxKwhCapacity.current, "jsx")}

                <div className="ChargingMenuInfo">
                    {<p>{`${finalDataCharging?.totalKWH ?? "--"} Kwh`}</p>}
                    {<p>{`+ ${finalDataCharging?.totalDistance ?? "--"} km`}</p>}
                    {<p>{`${finalDataCharging?.totalTimeInCharge ?? "--"} min`}</p>}
                </div>
            </>
            ):(
            <>

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

            </>
            )}


        </div>
    );
}

export default ChargingAnimation;