import { Database, QueryResult, RowsResult } from "../../Database/DatabaseConnection.js"
import  SQL  from "../../Database/DatabaseConnection.js"

//source from ResultSetHeader.d.ts | => QueryResult
type ResultSetHeader = {
    fieldCount:  number //0,
    affectedRows: number //1 | 0,
    insertId: number //0,
    info:  string //'Rows matched: 1  Changed: 1  Warnings: 0',
    serverStatus: number //2,
    warningStatus: number //0,
    changedRows: number //1 | 0
  }

class UpdateBookingStatus { 

    async updateReservationStatus( user_id : number ,reservation_id : number, status : string): Promise<0|1> {

        if(status === "cancelled")
        {
            const [result] = await SQL.query<QueryResult>(
                "UPDATE reservation SET status = ? WHERE id = ? AND user_id=? AND status NOT IN ('used', 'cancelled')",
                [status, reservation_id, user_id]
            );

            /* 
                Since result.changedRows is depreciated and result.affectedrows just return if row does exist & not return if changed
                => Solution is to parse result.info to check if "Changed" is 0 || 1
                ResultSetHeader.d.ts
            */

            const isReservationUpdated = result.info.includes(" Changed: 1 ");

            if(isReservationUpdated)
            return 1;
            else
            return 0;
        }

        if(status === "used")
        {
            const [result] = await SQL.query<QueryResult>(
                "UPDATE reservation SET status = ?, start_using = NOW() WHERE id = ? AND user_id=? AND status NOT IN ('used', 'cancelled')",
                [status, reservation_id, user_id]
            );

            const isReservationUpdated = result.info.includes(" Changed: 1 ");

            if(isReservationUpdated)
            return 1;
            else
            return 0;
        }

        return 0; //by default return 0 no row changed
        
    }

}

export default new UpdateBookingStatus();