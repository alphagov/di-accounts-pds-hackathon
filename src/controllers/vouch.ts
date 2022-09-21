import fs from "fs";
import fetch from "node-fetch";
import path from "path";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Url } from "../lib/models/common";
import { getHostname } from "../config";

async function download(url: Url, fileName: string) {
  const filePath = path.join(__dirname, "../", `public/images/${fileName}`);
  const response = await fetch(url);
  const buffer = await response.buffer();
  fs.writeFileSync(filePath, buffer);
  console.log(`finished downloading to ${filePath}!`);
}

// ======================================================
// Journey 1 Request someone to vouch for you
// ======================================================

// Start Page
export function requestVouchGet(req: Request, res: Response): void {
  res.render("govuk/request-vouch");
}

// Get Name
export function voucheeYourNameGet(req: Request, res: Response): void {
  res.render("vouch/request-vouch/your-name");
}

export function voucheeYourNamePost(req: Request, res: Response): void {
  if (req.session) {
    console.log(req.body);
    req.session.fullName = req.body.fullName;
  }
  res.redirect("/vouch/request-vouch/provide-photo");
}

// Get Photo
export function voucheeProvidePhotoGet(req: Request, res: Response): void {
  res.render("vouch/request-vouch/provide-photo");
}
export async function voucheeProvidePhotoPost(
  req: Request,
  res: Response
): Promise<void> {
  const imageName = `${uuidv4()}.jpg`;
  await download("https://thispersondoesnotexist.com/image", imageName);
  if (req.session) {
    req.session.photoUrl = `${getHostname()}/images/${imageName}`;
  }
  res.redirect("/vouch/request-vouch/confirmation");
}

// Confirmation page
export function voucheeConfirmationGet(req: Request, res: Response): void {
  if (req.session) {
    res.render("vouch/request-vouch/confirmation", {
      imageUrl: req.session.photoUrl,
      fullName: req.session.fullName,
    });
  }
}

// Journey completion page
export function voucheeDoneGet(req: Request, res: Response): void {
  res.render("vouch/request-vouch/done");
}

// ======================================================
// Journey 2 Review and vouch for someone
// ======================================================

export function vouchForSomeoneGet(req: Request, res: Response): void {
  res.render("govuk/vouch-for-someone");
}

export function voucheeVoucherDetailsGet(req: Request, res: Response): void {
  res.render("vouch/request-vouch/voucher-details");
}
