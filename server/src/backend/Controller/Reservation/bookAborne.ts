import type { RequestHandler } from "express";
import BadRequestError from "../../errors/badRequestErrors.js";
import bookAborneModel from "../../Model/Reservation/bookAborneModel.js";

const Update_BookAborne: RequestHandler = async (req, res, next) => {
  try {

    const { id_station } = req.body;
    const { id } = req.body.auth;
    
    const updated = await bookAborneModel.update(id_station, id); //update(id_station : number, user_id : number) 
 
    if (updated === 1){
      res.status(200).json({ msg: "Modification bien effectué" });
      return;
    }
    
    if(updated === -1){
      res.status(409).json({ msg: "Toutes les bornes de la station sont déjà réservées."});
      return;
    }

    if(updated === 0)
    return next(new BadRequestError({code:422, message : "Invalid parameter", logging: false, context : { ["Cannot book"] : "User has already one reservation underway. Only one per user." } }));

    else
    return next(new BadRequestError({code: 400, message: "Invalid parameter", logging: true, context : { ["Error update"] : "Error while reserving." }}));

  } catch (err) {
    next(err);
  }
};

export default { Update_BookAborne };