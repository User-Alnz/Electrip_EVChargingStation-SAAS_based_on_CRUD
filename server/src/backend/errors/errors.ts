import { ErrorRequestHandler } from "express";
import CustomError from "./customErrors.js";

export const errorHandler : ErrorRequestHandler = (err, req, res, next) :void => {
    // Handled errors
    if(err instanceof CustomError) {
      const { statusCode, errors, logging } = err;
      if(logging) {
        console.error(JSON.stringify({
          code: err.statusCode,
          errors: err.errors,
          stack: err.stack,
        }, null, 2));
      }
  
      res.status(statusCode).send({ errors });
      return;
    }
      // Unhandled errors
    console.error(JSON.stringify(err, null, 2));
    res.status(500).send({ errors: [{ message: "Something went wrong" }] });
    return; 
}