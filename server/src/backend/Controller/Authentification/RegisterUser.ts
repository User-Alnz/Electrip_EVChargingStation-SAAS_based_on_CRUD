import type { RequestHandler } from "express";
import BadRequestError from "../../errors/badRequestErrors.js";
import RegisterUserModel from "../../Model/Authentification/RegisterUserModel.js";

type reqBody = { 
    firstname : string, 
    lastname: string, 
    email: string, 
    hashed_password: string  
};

const saveInDB: RequestHandler = async (req, res, next) => 
{
    try 
    {
       const RegisterRequest:reqBody = req.body;

       const updated = await RegisterUserModel.RegisterUserInDataBase(RegisterRequest);

        if(updated === 1) 
            res.status(201).json({ msg: "user Created" });
        else 
            return next(new BadRequestError({code: 400, message: "Invalid request", logging: false, 
            context : { ["Cannot Register"]: "Check information you sent. Information need to be unique" } }));
        
    } catch (err) {
      next(err);
    }
}

export default {saveInDB}