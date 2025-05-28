import type { RequestHandler } from "express";
import BadRequestError from "../../errors/badRequestErrors.js";
import ShowBookingModel from "../../Model/ShowBooking/ShowBookingModel.js";


const Read_userBooking : RequestHandler = async (req, res, next) => {

    const { id } = req.body.auth; // from verifyToken and pass attach to body to secure it

    try{

        const userBookingInfo = await ShowBookingModel.readUserbookingUnderway(id); 

        if(!userBookingInfo)
        res.status(200).json([]);        
        else
        res.status(200).json(userBookingInfo);

    }
    catch(err){
        next(err);
    }
}

export default {Read_userBooking};