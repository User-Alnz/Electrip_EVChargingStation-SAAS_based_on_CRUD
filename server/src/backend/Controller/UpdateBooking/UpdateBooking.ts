import type { RequestHandler } from "express";
import BadRequestError from "../../errors/badRequestErrors.js";
import UpdateBookingStatus from "../../Model/UpdateBooking/UpdateBookingModel.js";

const Update_Booking : RequestHandler = async (req, res, next) => {

    const { id } = req.body.auth; // from verifyToken and pass attach to body to secure it
    const { reservation_id, status } = req.body;

    try{
        const isReservationUpdated = await UpdateBookingStatus.updateReservationStatus(id, reservation_id, status);

        if(isReservationUpdated)
        res.status(200).json({result : "success"});
        else
        return next(new BadRequestError({code: 400, message: "Invalid parameter", logging: true, context : { ["Error update"]: "Error while canceling reservation." } }));
    }
    catch(err){
        next(err);
    }
}

export default {Update_Booking};