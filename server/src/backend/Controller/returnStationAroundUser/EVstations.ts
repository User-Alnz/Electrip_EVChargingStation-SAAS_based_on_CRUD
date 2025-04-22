import type { RequestHandler } from "express";
import BadRequestError from "../../errors/badRequestErrors.js";
import EVStationsDB from "../../Model/EVStationsDB.js";

type catchQueryParameters = { latitude: string; longitude: string };

const AsyncRead_returnStationsAroundUser : RequestHandler = async (req, res, next) => {

    try {

        const catchQueryParameters: catchQueryParameters =
        req.query as catchQueryParameters;

        if(!catchQueryParameters)
        return next(new BadRequestError({code: 400, message: "Invalid Endpoints parameters", logging: true, context : { ["Request issue"]: "Verify coordinates send in query" } }));

        const StationsLocation = await EVStationsDB.getStationLocalisation(catchQueryParameters);

        res.status(202).json(StationsLocation);

    } catch (err) {
      next(err);
    }

};

export default {AsyncRead_returnStationsAroundUser};