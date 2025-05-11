import "dotenv/config";
import type { RequestHandler } from "express";
import { Request } from "express";
import BadRequestError from "../../errors/badRequestErrors.js";
import jwt , { JwtPayload, VerifyErrors } from "jsonwebtoken";
import LoginUserDB from "../../Model/Authentification/LoginUserDB.js";


interface changeReqForNextMiddleware extends Request{
    
    user?:{
      id: number,
      firstname: string,
      lastname: string,
      email: string,
    }
    
}

const secretKey = process.env.JWT_SECRET as string;
const refreshTokenKey = process.env.JWT_REFRESH_TOKEN as string;

const provideToken : RequestHandler = async (req :changeReqForNextMiddleware, res, next) => 
{
    try{

        const token = jwt.sign( 
        {
            id : req.user?.id,
            firstname : req.user?.firstname,
            lastname : req.user?.lastname,
            email : req.user?.email

        } ,secretKey, { expiresIn: "1m" });


        const refreshToken = jwt.sign(
        {
            email : req.user?.email

        }, refreshTokenKey, { expiresIn: '1d' });
        

        res.cookie( 'jwt', refreshToken, 
        {
            httpOnly: true,
            secure: false, //true for prod https
            sameSite: 'strict',
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        });

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
        const authHeader = req.headers.authorization;
        
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

    }
}

interface decodedRefreshToken extends JwtPayload { 
    email: string,  //'Joe@gmail.com', 
    iat: number,   // 1746262894, 
    exp: number    //1746349294 
}

type UserInfo = {
    id: number,
    firstname: string,
    lastname: string,
    email: string,
}

const verifyRefreshToken : RequestHandler = async (req, res, next) => {

    try{
        
        if(req.cookies?.jwt)
        {
            const refreshToken= req.cookies.jwt;

            jwt.verify( 
                refreshToken,
                refreshTokenKey,
                async (err: VerifyErrors | null,  decoded: string | JwtPayload | undefined ) => {
              
                    if(err || !decoded) 
                    {
                        return (new BadRequestError({code: 406, message: "RefToken expired", logging: true, 
                        context : { ["Invalid Creditentials"] : "Unauthorized" } }));   
                    }
                    else{

                        const {email} = decoded as decodedRefreshToken;

                        const RefreshUserInfo : UserInfo | false =  await LoginUserDB.verifyUserEmail(email);
                        
                        if(!RefreshUserInfo)
                            return next(new BadRequestError({code: 406, message: "Invalid request", logging: true, 
                            context : { ["Invalid Creditentials"]: "You are not the real user" } }));
                        else{
                            // Correct token we send a new access token
                            const token = jwt.sign( 
                                {
                                    id : RefreshUserInfo?.id,
                                    firstname : RefreshUserInfo?.firstname,
                                    lastname : RefreshUserInfo?.lastname,
                                    email : RefreshUserInfo?.email
                        
                                } ,secretKey, { expiresIn: "1m" });

                            res.status(200).json(
                                { 
                                    user : 
                                    {
                                        id : RefreshUserInfo?.id,
                                        firstname : RefreshUserInfo?.firstname,
                                        lastname : RefreshUserInfo?.lastname,
                                        email : RefreshUserInfo?.email
                                    },
                                    token: token,
                                });
                        }
                    }
                }
            );
        }
        else
        return next(new BadRequestError({code: 406, message: "RefToken expired", logging: false, 
        context : { ["Invalid Creditentials"] : "Unauthorized" } }));   
    }
    catch(err)
    {
        return next(new BadRequestError({code: 406, message: "RefToken expired", logging: false, 
        context : { ["Invalid Creditentials"] : "Unauthorized" } }));   
    }

}


export default { provideToken, verifyToken, verifyRefreshToken}