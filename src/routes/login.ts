import express from "express";
import { loginGet, callbackGet } from "../controllers/login";

const router = express.Router();

/* GET login page. */
router.get("/", loginGet);

router.get("/callback", callbackGet);

export default router;
