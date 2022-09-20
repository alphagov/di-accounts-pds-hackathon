import express, { Request, Response, NextFunction } from "express";
import redirectIfNotLoggedIn from "../lib/middleware/redirectIfNotLoggedIn";

import {
  accountHomeGet,
} from "../controllers/account";

const router = express.Router();

/* All following routes require someone to be logged in first */
// router.use((req: Request, res: Response, next: NextFunction) => {
//   redirectIfNotLoggedIn(req, res, next);
// });

router.get("/", accountHomeGet);

export default router;
