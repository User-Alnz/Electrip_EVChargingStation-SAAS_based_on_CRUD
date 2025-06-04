import { Database, QueryResult, RowsResult } from "../../Database/DatabaseConnection.js"
import  SQL  from "../../Database/DatabaseConnection.js"


interface ReservationHistoryData {
    currentPage : number;
    totalPages : number;
    result : [{
        id: number,
        borne_id: number,
        user_id: number,
        start_time: string,
        end_time: string,
        status: null,
        n_station : string,
        ad_station : string
    }];
}

type result = [{
    id: number,
    borne_id: number,
    user_id: number,
    start_time: string,
    end_time: string,
    status: null,
    n_station : string,
    ad_station : string
}]

type totalReservation = [ {totalRowsLength : number} ]; 


class ReservationHistoryModel {

    private async userBookingLength(userId : number)
    {

        const [totalRows] = await SQL.query<RowsResult>(
            "SELECT COUNT(*) AS totalRowsLength FROM reservation WHERE user_id=?",
            [userId]);

        return totalRows as totalReservation;
    }

    private async searchInUserBooking(userId : number, page : number) //Optimized method to not having going through all results to slice in.
    {
        page = page -1; //Because Offset start to 0 and page 1 is equivalent of 0;
        const offset = 5 * page;
        
        const [userBookingHistory] = await SQL.query<RowsResult>(
            "SELECT r.*, s.n_station, s.ad_station FROM reservation r JOIN bornes b ON r.borne_id = b.id JOIN station s ON b.station_id = s.id WHERE r.user_id = ? ORDER BY r.start_time DESC LIMIT ? OFFSET ?;",
            [userId, 5, offset]);

        return userBookingHistory as result;
    }

    private async formatOutputResult(userBookingHistory : result, page : number, totalPage? : number)
    {
        return {currentPage: page,
                totalPages: totalPage,
                result: userBookingHistory};
    }

    async readUserBookingHistory(userId : number, page : number, pages :number)
    {

        let userBookingHistory;
        
        //Catch first call to figure out totalPages for all result from Database and send it to save it in frontEnd to use it on next calls. To reuse on second call.
        if(pages === 0) 
        {
            userBookingHistory = await this.userBookingLength(userId);
            
            //this workout total of pages to chunk SQL querries
            const resultLength = userBookingHistory[0].totalRowsLength;
            const totalPage = Math.ceil(resultLength/5);

            userBookingHistory = await this.searchInUserBooking(userId, page);

            userBookingHistory = await this.formatOutputResult(userBookingHistory, page, totalPage);

            return userBookingHistory as ReservationHistoryData;
        }
 
        userBookingHistory = await this.searchInUserBooking(userId, page);
        userBookingHistory = await this.formatOutputResult(userBookingHistory, page, pages);

        return userBookingHistory as ReservationHistoryData;

    }

}

export default new ReservationHistoryModel();