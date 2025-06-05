import { Router } from "express";

const router = Router();

//login & registring methods
import HandlePassword from "./Controller/Authentification/HandlePassword.js";
import RegisterUser from "./Controller/Authentification/RegisterUser.js";
import LoginUser from "./Controller/Authentification/LoginUser.js";

router.post("/register", HandlePassword.hashPassword, RegisterUser.saveInDB);
router.post("/login", HandlePassword.passwordVerify, LoginUser.provideToken);
router.get("/api", LoginUser.verifyRefreshToken);

// -- get all station around user
import EVstations from "./Controller/GetEVStationAroundUser/EVstations.js";
router.get("/EVstations", LoginUser.verifyToken, EVstations.Read_returnStationsAroundUser);

// -- reserve a borne to reload your car
import bookAborne from "./Controller/Reservation/bookAborne.js";
router.put("/bookAborn", LoginUser.verifyToken, bookAborne.Update_BookAborne);

// -- return current user booking
import ShowBooking from "./Controller/ShowBooking/ShowBooking.js";
router.get("/booking", LoginUser.verifyToken, ShowBooking.Read_userBooking);

// -- return booking history
import ReservationHistory from "./Controller/ReservationHistory/ReservationHistory.js"
router.get("/bookingHistory", LoginUser.verifyToken, ReservationHistory.Read_userBookingHistory);

//-- Update userBooking
import userBooking from "./Controller/UpdateBooking/UpdateBooking.js";
router.put("/updateBooking", LoginUser.verifyToken, userBooking.Update_Booking);

export default router;