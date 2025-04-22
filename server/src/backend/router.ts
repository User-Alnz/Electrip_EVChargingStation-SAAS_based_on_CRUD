import { Router } from "express";

const router = Router();

import EVstations from "./Controller/returnStationAroundUser/EVstations.js";

router.get("/EVstations", EVstations.AsyncRead_returnStationsAroundUser);


export default router;