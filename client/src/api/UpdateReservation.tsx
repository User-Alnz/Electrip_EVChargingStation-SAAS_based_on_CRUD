import { toast } from "react-toastify";
import { Auth } from "../contexts/AuthContext";
import AuthApi from "./AuthApi";


interface bodyRequest {
    reservation_id : number,
    totalCost : number,
    totalKWH : number,
    totalTimeInCharge : number,
    totalDistance : number
}

class UpdateReservation {

    private token: string;
    private logout: () => void;
    private navigate: (path: string) => void;
    private setAuth: (auth: Auth) => void;

    constructor( token: string, logout: () => void, navigate: (path: string) => void, setAuth: (auth: Auth) => void)
    {
        this.token = token;
        this.logout = logout;
        this.navigate = navigate;
        this.setAuth = setAuth;
    }

    private async HttpRequest(token :string, bodyRequest? : bodyRequest){

        return fetch(
            `${import.meta.env.VITE_API_URL}/updateConsuption`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({bodyRequest})
            }
        );

    }
    
    private logoutAndRedirection()
    {
        this.logout();
        this.navigate("/");
        toast.error("Votre session a expiré. Merci de vous reconnecter.");   
    }

    public updateReservation = async(bodyRequest? : bodyRequest) => 
    {
        if (!this.token) {
            console.error("Token is undefined. Cannot update reservation.");
            this.logoutAndRedirection();
            return;
        }

        try
        {
            let response;
            
            response = await this.HttpRequest(this.token, bodyRequest);

            if(response.status == 403){
    
                const AuthToken : boolean | Auth = await AuthApi.tryRefreshToken();
    
                if(AuthToken && typeof(AuthToken) !== "boolean" && "token" in AuthToken)
                {  
                sessionStorage.setItem("user", JSON.stringify(AuthToken));
                this.setAuth(AuthToken);
    
                response = await this.HttpRequest(AuthToken?.token, bodyRequest);
                }
                else{
                    this.logoutAndRedirection();
                }
            }

            if(response.status == 406 || response.status == 401){
                this.logoutAndRedirection();
            }
    
        }
        catch(err)
        {
            console.error("Error fetching location or data:", err);
        }
    }


}   
export default UpdateReservation;