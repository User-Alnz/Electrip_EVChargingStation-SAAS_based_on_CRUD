import type { RequestHandler } from "express";
import argon2 from "argon2";

const hashPassword: RequestHandler = async (req, res, next) => {
    try {
      const { password } = req.body;
  
      const hashedPassword = await argon2.hash(password);
  
      req.body.hashed_password = hashedPassword;
      delete req.body.password;
  
      next();
    } catch (err) {
      next(err);
    }
}


export default {hashPassword};