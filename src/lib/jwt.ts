import * as jwt from "jsonwebtoken";
import {
  VerifiableCredentialPayloadType,
} from "./models/vc";
import { getJwtSigningKey, getClientId } from "../config";

export function generateJWT(payload: VerifiableCredentialPayloadType, subject: string) {
  const token = jwt.sign(
    {
      vc: payload,
    },
    getJwtSigningKey(),
    {
      expiresIn: "1y",
      issuer: getClientId(),
      subject,
    }
  );
  return token;
}
