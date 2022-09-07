import express from "express";
import { loginGet, loginPost, callbackGet } from "../controllers/login";

const router = express.Router();

/* GET login page. */
router.get("/", loginGet);

/* POST login page. */
router.post("/", loginPost);

router.get("/callback", callbackGet);

export default router;
