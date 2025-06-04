import type { RequestHandler } from "express";
import BadRequestError from "../../errors/badRequestErrors.js";
import ReservationHistoryModel from "../../Model/ReservationHistory/ReservationHistoryModel.js";

const  Read_userBookingHistory : RequestHandler = async (req, res, next) => 
{
    const { id } = req.body.auth;
    const page = Number.parseInt(req.query.page as string);
    const pages =  Number.parseInt(req.query.pages as string);
    
    try{

        const   userBookingHistory = await ReservationHistoryModel.readUserBookingHistory(id, page, pages);

        if(!userBookingHistory)
        return next(new BadRequestError({code: 400, message: "Invalid parameter", logging: false, context : { ["Error reading Data"]: "Error reading user reservation history"} }));

        res.status(200).json(userBookingHistory);

    }
    catch(err)
    {
        return next(new BadRequestError({code: 400, message: "Invalid parameter", logging: true, context : { ["Error reading Data"]: "Error reading user reservation history"} }));
    }
} 

export default {Read_userBookingHistory};