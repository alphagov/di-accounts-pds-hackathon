import { Request, Response } from "express";

export function accountHomeGet(req: Request, res: Response): void {
  res.render("account/home");
}
