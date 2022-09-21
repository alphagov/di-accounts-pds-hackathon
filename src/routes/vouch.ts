import express, { Request, Response, NextFunction } from "express";

import {
    requestVouchGet,
    vouchForSomeoneGet,
    voucheeYourNameGet,
    voucheeProvidePhotoGet,
    voucheeConfirmationGet,
    voucheeVoucherDetailsGet,
  } from "../controllers/vouch";
  
  const router = express.Router();

router.get("/request-vouch", requestVouchGet);
router.get("/vouch-for-someone", vouchForSomeoneGet);
router.get("/request-vouch/your-name", voucheeYourNameGet);
router.get("/request-vouch/provide-photo", voucheeProvidePhotoGet);
router.get("/request-vouch/voucher-details", voucheeVoucherDetailsGet);
router.get("/request-vouch/confirmation", voucheeConfirmationGet);

export default router;