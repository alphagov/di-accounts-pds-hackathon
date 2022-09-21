import { Request, Response } from "express";

export function requestVouchGet(req: Request, res: Response): void {
  res.render("govuk/request-vouch");
}

export function vouchForSomeoneGet(req: Request, res: Response): void {
    res.render("govuk/vouch-for-someone");
}
