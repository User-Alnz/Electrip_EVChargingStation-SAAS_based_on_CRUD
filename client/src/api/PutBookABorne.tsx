import { Auth } from "../contexts/AuthContext";
import ApiCallBluePrint from "./ApiCallPatterm";

class PutBookABorne extends ApiCallBluePrint {

    constructor( token: string, logout: () => void, navigate: (path: string) => void, setAuth: (auth: Auth) => void)
    {
        super(token, logout, navigate, setAuth);
    }

    protected HttpMethod() : "GET" | "PUT" | "POST" | "DELETE" {
        return "PUT";
    }
    protected getEndpoint() : string {
        return `bookAborn`;
    }
    protected doesReturnData() : boolean {
        return false;
    }
    protected doesReturnResponseOnly(): boolean {
        return false;
    }

    public async sendRequest(bodyRequest?: Object): Promise<any> {

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

            if (response.status === 200)
            this.handleToast("Votre borne a bien été réservée ! 😊", "success");
  

            if(response.status === 409)
            this.handleToast("Toutes les bornes de la station sont déjà réservées.", "error");
           
            
            if(response.status === 422)
            this.handleToast("Vous avez déjà une reservation en cours", "warn");


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

export default PutBookABorne;