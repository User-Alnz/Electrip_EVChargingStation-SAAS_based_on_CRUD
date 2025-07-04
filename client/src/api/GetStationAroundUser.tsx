import { Auth } from "../contexts/AuthContext";
import ApiCallBluePrint from "./ApiCallPatterm";

class GetStationAroundUser extends ApiCallBluePrint {

    private userCoordinates : [number, number];

    constructor( token: string, logout: () => void, navigate: (path: string) => void, setAuth: (auth: Auth) => void, location:[number, number])
    {
        super(token, logout, navigate, setAuth);
        this.userCoordinates = location;
    }

    protected HttpMethod() : "GET" | "PUT" | "POST" | "DELETE" {
        return "GET";
    }
    protected getEndpoint() : string {
        return `EVstations/?latitude=${this.userCoordinates[0]}&longitude=${this.userCoordinates[1]}`;
    }
    protected doesReturnData() : boolean {
        return true;
    }
    protected doesReturnResponseOnly(): boolean {
        return false;
    }
}

export default GetStationAroundUser;