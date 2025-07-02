import { Database, QueryResult, RowsResult } from "../../Database/DatabaseConnection.js"
import  SQL  from "../../Database/DatabaseConnection.js"

class UpdateUserConsumption{

    async updateConsumptionTable(reservation_id : number, totalCost : number, totalKWH: number, totalTimeInCharge: number, totalDistance:number)
    {
        try{

            const [result] = await SQL.query<QueryResult>(
                "INSERT INTO consumption ( reservation_id, cost, total_consumption, time_in_use,total_distance) VALUES (?, ?, ?, ?, ?); ",
                [reservation_id, totalCost, totalKWH, totalTimeInCharge, totalDistance]
            );
    
            return result.affectedRows;
        }
        catch(err:any)
        {
            if (err.code === "ER_DUP_ENTRY") { //Avoid logging useless SQL error because reservation_id is UNIQUE
                return 0;
            }
        
              // If other errors, log or rethrow
            throw err;
        }
    }
}

export default new UpdateUserConsumption();