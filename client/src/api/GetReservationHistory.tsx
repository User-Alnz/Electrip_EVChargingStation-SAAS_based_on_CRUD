import { Auth } from "../contexts/AuthContext";
import ApiCallBluePrint from "./ApiCallPatterm";


class GetReservationHistory extends ApiCallBluePrint{

    private currentPage : number;
    private totalPages : number;

    constructor( token: string, logout: () => void, navigate: (path: string) => void, setAuth: (auth: Auth) => void, currentPage:number, totalPages : number)
    {
        super(token, logout, navigate, setAuth);
        this.currentPage = currentPage;
        this.totalPages = totalPages;
    }

    protected HttpMethod() : "GET" | "PUT" | "POST" | "DELETE" {
        return "GET";
    }
    protected getEndpoint() : string {
        return `bookingHistory/?page=${this.currentPage}&pages=${this.totalPages}`;
    }
    protected doesReturnData() : boolean {
        return true;
    }
    protected doesReturnResponseOnly() : boolean {
        return false;
    }

    public async updateEndpointParameters(currentPage : number, totalPages: number) : Promise<void>
    {
        this.currentPage = currentPage;
        this.totalPages = totalPages;
    }
}

export default GetReservationHistory;