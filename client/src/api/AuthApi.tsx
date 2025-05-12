
import { Auth } from "../contexts/AuthContext";

const tryRefreshToken = async():Promise< Auth | boolean>  => {

    try{
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api`, 
        {
            method: "GET",
            credentials: "include", // send cookie
        });

        if(response.status === 406)
        return false;
        
        const Newtoken = await response.json();
        return Newtoken as Auth;
    }
    catch(error){
        console.error("Error in refreshing token:", error);
        return false;
    }
};

export default {tryRefreshToken};