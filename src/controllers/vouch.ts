import { Request, Response } from "express";

export function requestVouchGet(req: Request, res: Response): void {
  res.render("govuk/request-vouch");
}

export function vouchForSomeoneGet(req: Request, res: Response): void {
    res.render("govuk/vouch-for-someone");
}

export function voucheeYourNameGet(req: Request, res: Response): void {
  res.render("vouch/request-a-vouch/your-name");
}

export function voucheeProvidePhotoGet(req: Request, res: Response): void {
  res.render("vouch/request-a-vouch/provide-photo");
}

export function voucheeVoucherDetailsGet(req: Request, res: Response): void {
  res.render("vouch/request-a-vouch/voucher-details");
}

export function voucheeConfirmationGet(req: Request, res: Response): void {
  res.render("vouch/request-a-vouch/confirmation");
}
