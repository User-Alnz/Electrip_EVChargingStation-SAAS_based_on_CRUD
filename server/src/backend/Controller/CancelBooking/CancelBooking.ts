import type { RequestHandler } from "express";
import BadRequestError from "../../errors/badRequestErrors.js";
import CancelBookingModel from "../../Model/CancelBooking/CancelBookingModel.js";

const Update_userBooking : RequestHandler = async (req, res, next) => {

    const { id } = req.body.auth; // from verifyToken and pass attach to body to secure it
    const { reservation_id, status } = req.body;

    try{
        const isReservationUpdated = await CancelBookingModel.updateReservationStatus(reservation_id, status);

        if(isReservationUpdated)
        res.status(200).json({result : "success"});
        else
        return next(new BadRequestError({code: 400, message: "Invalid parameter", logging: true, context : { ["Error update"]: "Error while canceling reservation." } }));
    }
    catch(err){
        next(err);
    }
}

export default {Update_userBooking};