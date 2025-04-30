import "dotenv/config";
import type { RequestHandler } from "express";
import { Request } from "express";
import BadRequestError from "../../errors/badRequestErrors.js";
import jwt  from "jsonwebtoken";



interface changeReqForNextMiddleware extends Request{
    
    user?:{
      id: number,
      firstname: string,
      lastname: string,
      email: string,
    }
    
}

const secretKey = process.env.JWT_SECRET as string;

const provideToken : RequestHandler = async (req :changeReqForNextMiddleware, res, next) => 
{
    try{

        const token = jwt.sign( 
        {
            id : req.user?.id,
            firstname : req.user?.firstname,
            lastname : req.user?.lastname,
            email : req.user?.email

        } ,secretKey, { expiresIn: "1h" })

        res.status(200).json(
            {
                user : 
                {
                    id : req.user?.id,
                    firstname : req.user?.firstname,
                    lastname :  req.user?.lastname,
                    email : req.user?.email
                },
                token: token,
            }
        )
    }
    catch (err) {
        next(err);
    }
}

interface JWTerror{
    name: string, //ex => "TokenExpiredError",
    message:  string, //ex => "jwt expired",
    expiredAt:  string//ex =>"2025-04-30T07:58:08.000Z"
}
  

const verifyToken : RequestHandler = async (req, res, next) => 
{
    try{

        const authHeader = req.headers.authorization
        
        if(authHeader == null)
        return next(new BadRequestError({code: 401, message: "Invalid request", logging: false, 
        context : { ["Invalid Creditentials"] : "Not Authorized" } }));

        const [ typeAuth, token ] = authHeader.split(' '); //['Bearer', 'tokenHashed']

        if(typeAuth !== "Bearer")
        return next(new BadRequestError({code: 401, message: "Invalid request", logging: false, 
        context : { ["Invalid Creditentials"] : "Not Authorized" } }));

        const decodedToken = jwt.verify(token, secretKey);

        req.body.auth = decodedToken;
        
        next();
    }
    catch(err : JWTerror | any ){

        if(err.name == "TokenExpiredError")
        return next(new BadRequestError({code: 403, message: "Token expired", logging: true, 
        context : { ["Invalid Creditentials"] : "Not Authorized" } }));

        else
        return next(new BadRequestError({code: 401, message: "Invalid method auth", logging: true, 
        context : { ["Invalid Creditentials"] : "Not Authorized" } }));

        next(err);
    }
    
}

export default { provideToken, verifyToken}