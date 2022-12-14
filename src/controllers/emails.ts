import { Request, Response } from "express";

export function youHaveVouchedGet(req: Request, res: Response): void {
  res.render("emails/you-have-vouched");
}

export function youHaveBeenVouchedForGet(req: Request, res: Response): void {
  res.render("emails/you-have-been-vouched-for");
}

export function voucherRequestGet(req: Request, res: Response): void {
  const voucheeName = req.query.voucheeName ? req.query.voucheeName : "Person";
  if (req.session) {
    req.session.voucheeName = voucheeName;
  }

  res.render("emails/voucher-request", { voucheeName });
}
