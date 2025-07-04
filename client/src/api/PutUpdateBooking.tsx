import ApiCallBluePrint from "./ApiCallPatterm";

class PutUpdateBooking extends ApiCallBluePrint{

    protected HttpMethod(): "PUT" | "GET" | "POST" | "DELETE" {
        return "PUT";
    }
    protected getEndpoint(): string {
        return `updateBooking`;
    }
    protected doesReturnData(): boolean {
        return false;
    }
    protected doesReturnResponseOnly(): boolean {
        return true;
    }

    
}

export default PutUpdateBooking;