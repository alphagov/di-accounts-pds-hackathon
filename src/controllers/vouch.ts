import { Request, Response } from "express";

// ======================================================
// Journey 1 Request someone to vouch for you
// ======================================================

// Start Page
export function requestVouchGet(req: Request, res: Response): void {
  res.render("govuk/request-vouch");
}

export function requestVouchPost(req: Request, res: Response): void {
  res.redirect("/vouch/request-a-vouch/your-name");
}

// Get Name
export function voucheeYourNameGet(req: Request, res: Response): void {
  res.render("vouch/request-a-vouch/your-name");
}

export function voucheeYourNamePost(req:Request, res:Response): void {
  if (req.session) {
    req.session.fullName = req.body.fullName;
  }
  res.redirect("/vouch/request-a-vouch/provide-photo");
}

// Get Photo
export function voucheeProvidePhotoGet(req: Request, res: Response): void {
  res.render("vouch/request-a-vouch/provide-photo");
}

export function voucheeProvidePhotoPost(req: Request, res: Response): void {
  res.redirect("/vouch/request-a-vouch/confirmation");
}

// Confirmation page
export function voucheeConfirmationGet(req: Request, res: Response): void {
  res.render("vouch/request-a-vouch/confirmation");
}

// Journey completion page
export function voucheeDoneGet(req: Request, res: Response): void {
  res.render("vouch/request-a-vouch/done");
}

// ======================================================
// Journey 2 Review and vouch for someone
// ======================================================

export function vouchForSomeoneGet(req: Request, res: Response): void {
  res.render("govuk/vouch-for-someone");
}

export function voucheeVoucherDetailsGet(req: Request, res: Response): void {
  res.render("vouch/request-a-vouch/voucher-details");
}
