import "./ReservationHistory.css";
import location from "/location.png";
import Pagination from "../../Pagination/Pagination";
import NoReservationUnderway from "../NoReservationReturned/NoReservationUnderway";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth, useAuth } from "../../../contexts/AuthContext";
import AuthApi from "../../../api/AuthApi";
import { toast } from "react-toastify";
import {transformIsoToUIRequiredFormat, interpretReservationStatus, defineBorderBoxStyle}  from "./ReservationHystoryToolBox";


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

    useEffect(() => {

        const returnUserReservationHistory = async () => {

            try
            {
                let response;
                let data;

                response = await fetch(
                `${import.meta.env.VITE_API_URL}/bookingHistory/?page=${currentPage}&pages=${totalPages}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${auth?.token}`,
                        'Content-Type': 'application/json',
                    },
                }
                );

                if(response.status == 403){
          
                    const AuthToken : boolean | Auth = await AuthApi.tryRefreshToken();
          
                    if(AuthToken && typeof(AuthToken) !== "boolean"  && "token" in AuthToken) 
                    {  
                      sessionStorage.setItem("user", JSON.stringify(AuthToken));
                      setAuth(AuthToken);
          
                      response = await fetch(
                        `${import.meta.env.VITE_API_URL}/bookingHistory/?page=${currentPage}&pages=${totalPages}`,
                        {
                          method: 'GET',
                          headers: {
                            'Authorization': `Bearer ${AuthToken?.token}`,
                            'Content-Type': 'application/json',
                          },
                      });
                    }
                    else{
                      logout();
                      navigate("/");
                      toast.error("Votre session a expirée. Merci de vous reconnecter");
                    }
          
                }
                
                if(response.status == 406 || response.status == 401){
                    logout();
                    navigate("/");
                    toast.error("Votre session a expirée. Merci de vous reconnecter");
                }
          
                data = await response.json();

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
                                        <p>+{item.total_consumption} km</p>
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