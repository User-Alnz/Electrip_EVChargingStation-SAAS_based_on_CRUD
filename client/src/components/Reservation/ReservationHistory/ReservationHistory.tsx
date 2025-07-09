import "./ReservationHistory.css";
import location from "/location.png";
import Pagination from "../../Pagination/Pagination";
import NoReservationUnderway from "../NoReservationReturned/NoReservationUnderway";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import {transformIsoToUIRequiredFormat, interpretReservationStatus, defineBorderBoxStyle}  from "./ReservationHystoryToolBox";
import GetReservationHistory from "../../../api/GetReservationHistory";


interface bookingHistoryObject {
    currentPage : number;
    totalPages : number;
    result : {
        id: number,
        borne_id: number,
        user_id: number,
        start_time: string,
        end_time: string,
        status: "used" | "cancelled" | "reserved",
        n_station : string,
        ad_station : string,
        cost: string | null,
        total_consumption: string | null,
        time_in_use: number | null,
        total_distance: string | null,
    }[];
}

function ReservationHistory()
{
    const [ currentPage, setCurrentPage ] = useState<number>(1);
    const [ totalPages, setTotalPages ] = useState<number>(0); // start from 0 imp to notify first call and compute totalpages from backend.
    const [ userBookingHistory, setUserBookingHistory ] = useState<bookingHistoryObject>();
    const { auth, logout, setAuth } = useAuth();
    const navigate = useNavigate();
    const ApiCall = useRef<GetReservationHistory|null>(null);

    useEffect(() => {

        const returnUserReservationHistory = async () => {

            try
            {   
                let data : bookingHistoryObject | any;

                ApiCall.current = new GetReservationHistory(auth?.token as string, logout, navigate, setAuth, currentPage, totalPages);
                await ApiCall.current.updateEndpointParameters(currentPage, totalPages);
                data = await ApiCall.current.sendRequest();

                setTotalPages(data.totalPages);
                setUserBookingHistory(data);

            }
            catch(err){
                console.error("Error fetching location or data:", err);
            }
            
        }

        returnUserReservationHistory();

    },[currentPage]);

    return(
        <section>
            
            
            <div className="WrapStationHistoryCards">

            {!userBookingHistory?.result || userBookingHistory.result.length === 0 ? (<NoReservationUnderway MessageToDisplay="Encore aucune reservation" /> ) : (

                userBookingHistory?.result?.map((item, index)=> (

                    <div key={index} className="StationHistoryCard" style={defineBorderBoxStyle(item.status)}>
                        
                        <h1>statut : {interpretReservationStatus(item.status)}</h1>
                        
                        <div className="HistoryCardStationInfo">

                            <p className="HistoryCardStationName">{item.n_station}</p>

                            <div className="HistoryCardStationInfoAdress">
                                <img src={location} alt="icon of location"/> 
                                <p>{item.ad_station}</p>
                            </div>
                            
                            <div className="drawLineEffect"></div>

                            {item.cost !== null ? (
                                <div className="HistoryCardStationExtraInfo">
                                    <p className="HistoryCardStationExtraInfoPrice">{item.cost} €</p>

                                    <div className="HistoryCardStationExtraInfoWrap">
                                        <p>{item.total_consumption} Kwh</p>
                                        <p>+{item.total_distance} km</p>
                                        <p>{item.time_in_use} min</p>
                                    </div>
                                </div>
                            ) : null}

                        </div>

                        <p className="HistoryCardStationDate">{transformIsoToUIRequiredFormat(item.start_time)}</p>

                    </div>
                )) 
                
            )}

            {userBookingHistory?.result && userBookingHistory.result.length > 0 ?  (

                <Pagination resultLength={totalPages}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}/>
            ) : null}

            </div>
            

        </section>
    )
}

export default ReservationHistory;