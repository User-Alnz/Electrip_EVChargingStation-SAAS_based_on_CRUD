import { toast } from "react-toastify";
import { Auth } from "../contexts/AuthContext";

abstract class ApiCallBluePrint{

    protected token: string;
    protected logout: () => void;
    protected navigate: (path: string) => void;
    protected setAuth: (auth: Auth) => void;

    constructor( token: string, logout: () => void, navigate: (path: string) => void, setAuth: (auth: Auth) => void)
    {
        this.token = token;
        this.logout = logout;
        this.navigate = navigate;
        this.setAuth = setAuth;
    }

    protected abstract HttpMethod(): "GET"| "PUT" | "POST" | "DELETE"; //Can be extended
    protected abstract getEndpoint(): string;
    protected abstract doesReturnData(): boolean;
    protected abstract doesReturnResponseOnly(): boolean;

    //Modular HTTP Method on abstract function
    protected async HttpRequest(token :string,  bodyRequest? : Object) : Promise<any>
    {

        return fetch(
            `${import.meta.env.VITE_API_URL}/${this.getEndpoint()}`,
            {
                method: `${this.HttpMethod()}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: bodyRequest ? JSON.stringify(bodyRequest) : undefined,
            }
        );

    }

    //Refresh Token Method
    protected async tryRefreshToken() : Promise< Auth | boolean>
    {
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
    
    //Method To logout user if invalid Token 
    protected logoutAndRedirection() : void
    {
        this.logout();
        this.navigate("/");
        toast.error("Votre session a expiré. Merci de vous reconnecter.");   
    }

    //Method to handle toast
    protected handleToast(message :string, Option? : "success"|"error"|"warn")
    {
        if(Option === undefined)
        return toast.error(message);

        if(Option ==="success")
        return toast.success(message);

        if(Option ==="error")
        return toast.error(message);

        if(Option ==="warn")
        return toast.warn(message);

        return
    }

    //MAIN
    public async sendRequest(bodyRequest? : Object) : Promise<any>
    {
        if (!this.token) {
            console.error("Token is undefined. Cannot update reservation.");
            this.logoutAndRedirection();
            return;
        }

        try
        {
            let response;
            let data;
            
            response = await this.HttpRequest(this.token, bodyRequest);

            if(response.status == 403)
            {
                const AuthToken : boolean | Auth = await this.tryRefreshToken();
    
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
            
            if(this.doesReturnResponseOnly() === true)
            return response;

            if(this.doesReturnData() === true)
            {
                data = await response.json();
                return data;
            }  
        }
        catch(err)
        {
            console.error("Error fetching location or data:", err);
        }
    }


}   
export default ApiCallBluePrint;