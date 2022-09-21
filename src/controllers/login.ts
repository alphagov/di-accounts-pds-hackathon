import { Request, Response } from "express";
import {
  getSessionFromStorage,
  Session,
} from "@inrupt/solid-client-authn-node";

import { getHostname } from "../config";

export async function loginGet(req: Request, res: Response): Promise<void> {
  const session = new Session();
  if (req.session) {
    req.session.sessionId = session.info.sessionId;
    if (req.query.returnUri) {
      req.session.returnUri = req.query.returnUri;
    }
  }
  const redirectToSolidIdentityProvider = (url: string) => {
    res.redirect(url);
  };
  await session.login({
    redirectUrl: `${getHostname()}/login/callback`,
    oidcIssuer: "https://login.inrupt.com",
    clientName: "GDS PDS prototype app",
    handleRedirect: redirectToSolidIdentityProvider,
  });
}

export async function callbackGet(req: Request, res: Response): Promise<void> {
  const session = await getSessionFromStorage(req.session?.sessionId);
  await session?.handleIncomingRedirect(`${getHostname()}${req.originalUrl}`);

  if (session?.info.isLoggedIn) {
    if (req.session && req.session.returnUri) {
      const { returnUri } = req.session;
      delete req.session.returnUri;
      res.redirect(returnUri);
    } else {
      res.redirect("/");
    }
  }
}
