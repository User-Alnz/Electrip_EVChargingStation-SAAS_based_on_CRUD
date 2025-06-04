import "./ReservationHistory.css";
import location from "/location.png";
import Pagination from "../../Pagination/Pagination";
import NoReservationUnderway from "../NoReservationReturned/NoReservationUnderway";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth, useAuth } from "../../../contexts/AuthContext";
import AuthApi from "../../../api/AuthApi";
import { toast } from "react-toastify";
import transformIsoToUIRequiredFormat  from "./ReservationHystoryToolBox";


interface bookingHistoryObject {
    currentPage : number;
    totalPages : number;
    result : {
        id: number,
        borne_id: number,
        user_id: number,
        start_time: string,
        end_time: string,
        status: null,
        n_station : string,
        ad_station : string
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
          
                    if(AuthToken && typeof(AuthToken) !== "boolean"  && "token" in AuthToken) // there is one thing to enhance here 
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

            {!userBookingHistory?.result? (<NoReservationUnderway MessageToDisplay="Encore Aucune reservation" /> ) : (

                userBookingHistory?.result?.map((item, index)=> (

                    <div key={index} className="StationHistoryCard">
                        
                        <h1>status : {item.status}</h1>
                        
                        <div className="HistoryCardStationInfo">

                            <p className="HistoryCardStationName">{item.n_station}</p>

                            <div className="HistoryCardStationInfoAdress">
                                <img src={location} alt="icon of location"/> 
                                <p>{item.ad_station}</p>
                            </div>
                            
                            <div className="drawLineEffect"></div>

                        </div>

                        <p className="HistoryCardStationDate">{transformIsoToUIRequiredFormat(item.start_time)}</p>

                    </div>
                )) 
                
            )}

            {userBookingHistory?.result? (

                            <Pagination resultLength={totalPages}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage} />
            ) : null}

            </div>
            

        </section>
    )
}

export default ReservationHistory;