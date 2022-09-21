import express, { Request, Response, NextFunction } from "express";

import {
    requestVouchGet,
    vouchForSomeoneGet,
  } from "../controllers/vouch";
  
  const router = express.Router();

router.get("/request-vouch", requestVouchGet);
router.get("/vouch-for-someone", vouchForSomeoneGet);

export default router;