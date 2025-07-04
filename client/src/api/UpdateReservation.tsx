import ApiCallBluePrint from "./ApiCallPatterm";

class UpdateReservation extends ApiCallBluePrint{
    protected HttpMethod(): "GET" | "PUT" | "POST" | "DELETE" {
        return "PUT";
    }
    protected getEndpoint(): string {
        return "updateConsumption";
    }
    protected doesReturnData(): boolean {
        return false;
    }
    protected doesReturnResponseOnly(): boolean {
        return false;
    }
    
}

export default UpdateReservation;