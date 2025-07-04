import ApiCallBluePrint from "./ApiCallPatterm";


class GetBooking extends ApiCallBluePrint{

    protected HttpMethod(): "GET" | "PUT" | "POST" | "DELETE" {
        return "GET";
    }
    protected getEndpoint(): string {
        return "booking/";
    }
    protected doesReturnData(): boolean {
        return true;
    }
    protected doesReturnResponseOnly(): boolean {
        return false;
    }
}

export default GetBooking;