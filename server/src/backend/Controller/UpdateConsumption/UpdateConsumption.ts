import type { RequestHandler } from "express";
import BadRequestError from "../../errors/badRequestErrors.js";
import UpdateConsumptionModel from "../../Model/UpdateConsumption/UpdateConsumptionModel.js";

type bodyRequest = {
    reservation_id: number , //78,
    totalCost: number, //17.96,
    totalKWH: number //49.88,
    totalTimeInCharge: number, //59,
    totalDistance: number, //332.53
}

const Update_Consumption : RequestHandler = async (req, res, next) => {

    //const { id } = req.body.auth; // from verifyToken and pass attach to body to secure it
    const { reservation_id, totalCost, totalKWH, totalTimeInCharge, totalDistance } = req.body.bodyRequest;

    try{
        
        const isConsumptionUpdated = await UpdateConsumptionModel.updateConsumptionTable(reservation_id, totalCost, totalKWH, totalTimeInCharge, totalDistance);
        
        if(isConsumptionUpdated === 1 )
        res.status(200).json({result : "success"});
        else if(isConsumptionUpdated === 0 )
        return next(new BadRequestError({code: 400, message: "Invalid parameter", logging: false, context : { ["Error update"]: "Error already updated" } }));
        else
        return next(new BadRequestError({code: 500, message: "Unexpected error", logging: true, context : { ["Error update"]: "Check consumption Update_Consumption" } }));
        
    }
    catch(err){
        next(err);
    }
}

export default {Update_Consumption};