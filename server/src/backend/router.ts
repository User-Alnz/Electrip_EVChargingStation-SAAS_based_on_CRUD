import { Router } from "express";

const router = Router();

import EVstations from "./Controller/GetEVStationAroundUser/EVstations.js";

router.get("/EVstations", EVstations.Read_returnStationsAroundUser);

import bookAborne from "./Controller/Reservation/bookAborne.js";

router.put("/bookAborn", bookAborne.Update_BookAborne)

import HandlePassword from "./Controller/Authentification/HandlePassword.js";
import RegisterUser from "./Controller/Authentification/RegisterUser.js";

router.post("/register", HandlePassword.hashPassword, RegisterUser.saveInDB);

export default router;