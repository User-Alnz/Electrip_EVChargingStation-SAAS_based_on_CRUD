import { Router } from "express";

const router = Router();

//login & registring methods
import HandlePassword from "./Controller/Authentification/HandlePassword.js";
import RegisterUser from "./Controller/Authentification/RegisterUser.js";
import LoginUser from "./Controller/Authentification/LoginUser.js";

router.post("/register", HandlePassword.hashPassword, RegisterUser.saveInDB);
router.post( "/login", HandlePassword.passwordVerify,  LoginUser.provideToken);

// -- get all station around user
import EVstations from "./Controller/GetEVStationAroundUser/EVstations.js";
router.get("/EVstations", LoginUser.verifyToken, EVstations.Read_returnStationsAroundUser);

// -- reserve a borne to reload your car
import bookAborne from "./Controller/Reservation/bookAborne.js";
router.put("/bookAborn", LoginUser.verifyToken, bookAborne.Update_BookAborne);


export default router;