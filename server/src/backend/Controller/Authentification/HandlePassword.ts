import type { RequestHandler } from "express";
import { Request } from "express";
import LoginUserModel from "../../Model/Authentification/LoginUserDB.js";
import BadRequestError from "../../errors/badRequestErrors.js";
import argon2 from "argon2";

type UserInfo = {
  id: number,
  firstname: string,
  lastname: string,
  email: string,
  hashed_password: string
}

const hashPassword: RequestHandler = async (req, res, next) => {
    try {
      const { password } = req.body;
  
      const hashedPassword = await argon2.hash(password);
  
      req.body.hashed_password = hashedPassword;
      delete req.body.password;
  
      next();
    } catch (err) {
      next(err);
    }
}

interface changeReqForNextMiddleware extends Request{
  user?:{
    id: number,
    firstname: string,
    lastname: string,
    email: string,
  }
  
}

const passwordVerify : RequestHandler = async (req : changeReqForNextMiddleware , res, next) => {
  try{

    const { email, password } = req.body;

    const user : UserInfo | false = await LoginUserModel.verifyUserEmail(email);

    if(!user)
    return next(new BadRequestError({code: 401, message: "Invalid request", logging: false, 
    context : { ["Invalid Creditentials"]: "Email or password Invalid" } }));

    const isPassWordValid = await argon2.verify(user.hashed_password, password);
    
    if(!isPassWordValid)
    return next(new BadRequestError({code: 401, message: "Invalid request", logging: false, 
    context : { ["Invalid Creditentials"]: "Email or password Invalid" } }));

    //This add user info into request just to pass it next middleware // 
    //why ? Simply to avoid second call to DB because we already have info from .verifyUserEmail(email)
    req.user = { 
      id : user.id,
      firstname : user.firstname,
      lastname : user.lastname,
      email : user.email,
    }

    next();
  }
  catch(err){
    next(err);
  }

}

export default {hashPassword, passwordVerify};