import { error } from "console";
import { Database, QueryResult, RowsResult } from "../../Database/DatabaseConnection.js"
import  SQL  from "../../Database/DatabaseConnection.js"
import type { MysqlError } from "../errors/ModelErrors.js"


type catchQueryParameters = { 
        firstname : string, 
        lastname: string, 
        email: string, 
        hashed_password: string  
    };

class RegistrationModel {

    async RegisterUserInDataBase(query :catchQueryParameters)
    {
        try
        {
            const [result] = await SQL.query<QueryResult>(
                "INSERT INTO user_account (firstname, lastname, email, hashed_password) VALUES(?, ?, ?, ?)",
                [query.firstname, query.lastname, query.email, query.hashed_password]
            )
    
            return result.affectedRows; // 0 || 1
        }
        catch(err : any | MysqlError)
        {
            //debug // throw err;
           return err;
        }
        
    }


}

export default new RegistrationModel();