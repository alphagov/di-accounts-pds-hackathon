import express, { Request, Response, NextFunction } from "express";

import {
  youHaveVouchedGet,
  youHaveBeenVouchedForGet,
  voucherRequestGet,
} from "../controllers/emails";

const router = express.Router();

router.get("/you-have-vouched", youHaveVouchedGet);
router.get("/you-have-been-vouched-for", youHaveBeenVouchedForGet);
router.get("/voucher-request", voucherRequestGet);

export default router;
