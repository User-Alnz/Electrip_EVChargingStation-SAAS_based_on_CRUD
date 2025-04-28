import type { RequestHandler } from "express";
import BadRequestError from "../../errors/badRequestErrors.js";
import bookAborneModel from "../../Model/Reservation/bookAborneModel.js";

const Update_BookAborne: RequestHandler = async (req, res, next) => {
  try {

    const { id_station } = req.body;
    const { id } = req.body.auth;
    
    const updated = await bookAborneModel.update(id_station, id); //update(id_station : number, user_id : number) 
 
    if (updated === 1) {
      res.status(200).json({ msg: "modification bien effectué" });
    } else {
      return next(new BadRequestError({code: 400, message: "Invalid parameter", logging: true, context : { ["Error update"]: "Error while reserving borne." } }));
    }
  } catch (err) {
    next(err);
  }
};

export default { Update_BookAborne };