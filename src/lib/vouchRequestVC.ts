import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";


import {
  Url,
  Base64EncodedString
} from "./models/common"

import {
  generateJWT
} from "./jwt"

import {
  VouchRequestVC
} from "./models/vc"

function addMonths(date: Date, months: number) {
  date.setMonth(date.getMonth() + months);
  return date;
}

async function base64EncodeFile(photoUrl: Url): Promise<Base64EncodedString> {
  const response = await fetch(photoUrl);
  const buffer = await response.buffer();
  return 'data:image/jpg;base64,' +   buffer.toString('base64');
  }

async function vouchRequestVCData(
  session: CookieSessionInterfaces.CookieSessionObject,
): Promise<VouchRequestVC> {
  return {
    type: ["VerifiableCredential", "VouchRequest"],
    request: {
      voucher: session.voucherWebId,
      vouchee: session.webid,
      name: session.fullName,
      photo: await base64EncodeFile(session.photoUrl),
      issued: new Date(),
      expires: addMonths(new Date(), 12),
      id: uuidv4()
    }
  }
}

export async function buildVouchRequestVC(
  session: CookieSessionInterfaces.CookieSessionObject,
): Promise<string> {
  const payload = await vouchRequestVCData(session);

  return generateJWT(payload, session.webId);
}