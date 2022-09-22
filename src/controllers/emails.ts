import { Request, Response } from "express";

export function youHaveVouchedGet(req: Request, res: Response): void {
  res.render("emails/you-have-vouched");
}

export function youHaveBeenVouchedForGet(req: Request, res: Response): void {
  res.render("emails/you-have-been-vouched-for");
}

export function voucherRequestGet(req: Request, res: Response): void {
  const voucherName = req.query.voucherName ? req.query.voucherName : "Person";
  if (req.session) {
    req.session.voucherName = voucherName;
  }

  res.render("emails/voucher-request", { voucherName });
}
