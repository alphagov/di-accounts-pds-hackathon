import { Request, Response } from "express";
import { getHostname, getClientId } from "../config";

export type ClientIdDocument = {
  "@context": string[];
  client_id: string;
  client_name: string;
  client_uri: string;
  post_logout_redirect_uris: string[];
  redirect_uris: string[];
  scope: string;
  grant_types: string[];
};

export function buildClientIdDocument(): ClientIdDocument {
  return {
    "@context": ["https://www.w3.org/ns/solid/oidc-context.jsonld"],
    client_id: getClientId(),
    client_name: "GDS Solid Vouching Hackathon submission concept app",
    client_uri: getHostname(),
    post_logout_redirect_uris: [getHostname()],
    redirect_uris: [
      `${getHostname()}/login/callback`,
      "http://localhost:3000/login/callback",
    ],
    scope: "openid profile offline_access webid",
    grant_types: ["refresh_token", "authorization_code"],
  };
}

export function idGet(req: Request, res: Response) {
  res.json(buildClientIdDocument());
}