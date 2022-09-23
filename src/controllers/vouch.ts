import fs from "fs";
import fetch from "node-fetch";
import path from "path";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Url } from "../lib/models/common";
import { getHostname } from "../config";
import { getSessionFromStorage } from "@inrupt/solid-client-authn-node";

import { createVcBlob } from "../lib/pod"


import {
  getDatasetUri,
  writeVouchVcToPod
} from "../lib/pod";

import SessionError from "../errors";
import { VouchArtifact } from "../lib/models/vc";

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
  res.redirect("/vouch/request-vouch/voucher-details");
}

// Who is vouching for you?
export function voucheeVoucherDetailsGet(req: Request, res: Response): void {
  res.render("vouch/request-vouch/voucher-details");
}

export function voucheeVoucherDetailsPost(req: Request, res: Response): void {
  if (req.session) {
    req.session.voucherEmail = req.body.voucherEmail;
    req.session.voucherWebId = req.body.voucherWebId;
  }
  res.redirect("/vouch/request-vouch/confirmation");
}

// Confirmation page
export function voucheeConfirmationGet(req: Request, res: Response): void {
  if (req.session) {
    res.render("vouch/request-vouch/confirmation", {
      imageUrl: req.session.photoUrl,
      fullName: req.session.fullName,
      voucherEmail: req.session.voucherEmail,
      voucherWebId: req.session.voucherWebId,
    });
  }
}

export async function voucheeConfirmationPost(req: Request, res: Response): Promise<void> {
  const session = await getSessionFromStorage(req.session?.sessionId);
  if (session && session.info && session.info.webId) {
    const vouchRequestUUID = uuidv4()

    const containerUri = await getDatasetUri(
      session,
      `vouch/${vouchRequestUUID}`
    );

    const fileUri = `${containerUri}/vouch-request-vc`;

    if (req.session) {
      const appSession: CookieSessionInterfaces.CookieSessionObject = req.session
      appSession.webId = session.info.webId
      const blobFile = await createVcBlob(appSession)
    
      const vouchArtifact: VouchArtifact = {
        file: blobFile,
        fileUri: fileUri
      }
  
      await writeVouchVcToPod(session, vouchArtifact);
  res.redirect("/vouch/request-vouch/done");
    }
  } else {
    throw new SessionError();
  }
}

// Journey completion page
export function voucheeDoneGet(req: Request, res: Response): void {
  if (req.session) {
    res.render("vouch/request-vouch/done", { voucher: req.session.voucherEmail });
  }
}

// ======================================================
// Journey 2 Review and vouch for someone
// ======================================================

export function vouchForSomeoneGet(req: Request, res: Response): void {
  if (req.session) {
    res.render("govuk/vouch-for-someone", {
      voucheeName: req.session.voucheeName,
    });
  }
}

// Identity confirmation page after logging in to a GOV.UK account
export function useSavedProofOfIdGet(req: Request, res: Response): void {
  res.render("vouch/vouch-for-someone/use-saved-proof-of-identity");
}

// Pick vouchee out of a line-up
export function confirmLikenessGet(req: Request, res: Response): void {
  if (req.session) {
    res.render("vouch/vouch-for-someone/confirm-likeness", {
      voucheeName: req.session.voucheeName,
    });
  }
}

export function confirmLikenessPost(req: Request, res: Response): void {
  res.redirect("/vouch/vouch-for-someone/confirm-details");
}

// Confirm vouchee details and read disclaimer
export function confirmDetailsGet(req: Request, res: Response): void {
  if (req.session) {
    res.render("vouch/vouch-for-someone/confirm-details", {
      voucheeName: req.session.voucheeName,
    });
  }
}

export function confirmDetailsPost(req: Request, res: Response): void {
  res.redirect("/vouch/vouch-for-someone/done");
}

// End of voucher journey
export function voucherEndGet(req: Request, res: Response): void {
  if (req.session) {
    res.render("vouch/vouch-for-someone/done", {
      voucheeName: req.session.voucheeName,
    });
  }
}
