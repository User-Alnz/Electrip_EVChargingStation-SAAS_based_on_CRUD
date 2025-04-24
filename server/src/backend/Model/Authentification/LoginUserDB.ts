import { Database, QueryResult, RowsResult } from "../../Database/DatabaseConnection.js"
import  SQL  from "../../Database/DatabaseConnection.js"
import type { MysqlError } from "../errors/ModelErrors.js"

type UserInfo = {
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    hashed_password: string
}

class LoginUserModel {

async verifyUserEmail(email: string)
{
    try
    {
        // reminder email is defined as unique in MPD 
        const [row] = await SQL.query<RowsResult>(
            "SELECT * FROM user_account WHERE email = ?",
            [email]
        )
        
        if(row.length < 1)
            return false;

        return row[0] as UserInfo[];
    
    }
    catch(err : any | MysqlError)
    {
        //throw err; 
       return err;
    }
    
}


}

export default new LoginUserModel();