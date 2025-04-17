import { Database, QueryResult, RowsResult } from "../Database/DatabaseConnection.js"
import  SQL  from "../Database/DatabaseConnection.js"

class SQLqueryExemple{

    async Read(){

        const [result] = await SQL.query<RowsResult>(
            `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? LIMIT 5`, 
            [process.env.DB_NAME] 
        );
        
        return result;
    } 
}

export default new SQLqueryExemple;