import { Request, Response } from "express";

import {
  getSessionFromStorage,
  Session
} from "@inrupt/solid-client-authn-node";

import {
  AccessRequest,
  approveAccessRequest,
  denyAccessRequest,
} from "@inrupt/solid-client-access-grants";

import {
  createSolidDataset,
  getSolidDataset,
  saveSolidDatasetAt,
} from "@inrupt/solid-client";


import {
  isAccessRequest,
  isString,
  validateAccessRequestVC
} from "../lib/validators"


// ===========================================
// Access Management Helper Functions
// ===========================================
function decodeAccessRequestVC(encodedJwt: string): AccessRequest {
  if (!encodedJwt) {
    throw new Error("no encoded token found");
  }

  const buff = Buffer.from(encodedJwt, "base64");
  const decodedToken = JSON.parse(buff.toString("utf-8"));

  if (!isAccessRequest(decodedToken)) {
    throw new Error("invalid token object");
  }
  return decodedToken;
}

async function createDatasetIfNotExists(
  session: Session,
  resourceUri: string
): Promise<void> {
  try {
    console.log(`seeing if ${resourceUri} exists`);
    await getSolidDataset(resourceUri, { fetch: session.fetch });
  } catch (FetchError) {
    console.log("it doesn't, creating it");
    await saveSolidDatasetAt(resourceUri, createSolidDataset(), {
      fetch: session.fetch,
    });
    console.log("created");
  }
}

// ===========================================
// GET - Access Management
// ===========================================
export async function accessManagementGet(
  req: Request,
  res: Response
): Promise<void> {
  const solidSession = await getSessionFromStorage(req.session?.sessionId);
  const appSession = req.session;
  if (solidSession && appSession) {
    if (req.query) {
      const { requestVc, redirectUrl, requestVcUrl } = req.query;
      if (isString(requestVc) && isString(redirectUrl)) {
        // Decode the request VC
        appSession.requestVcDecoded = decodeAccessRequestVC(requestVc);

        if (!appSession.requestVcDecoded) {
          res.redirect("account/access-management/errors/vc-not-decodable");
        }

        // Validate the VC
        if (!validateAccessRequestVC(appSession.requestVcDecoded)) {
          res.redirect("account/access-management/errors/vc-invalid");
        }

        const { credentialSubject } = appSession.requestVcDecoded;

        res.render("account/access-management", {
          credentialSubject,
          requestVc,
          requestVcUrl,
          redirectUrl,
        });
      }
    } else {
      res.redirect("account/access-management/errors/no-vc-request-found");
    }
  }
}

// ===========================================
// POST - Access Management
// ===========================================
export async function accessManagementPost(
  req: Request,
  res: Response
): Promise<void> {
  if (req.body) {
    const solidSession = await getSessionFromStorage(req.session?.sessionId);
    const { requestVc, requestVcUrl, redirectUrl, consent } = req.body;
    if (solidSession && isString(redirectUrl)) {
      // If the container the access grant refers to doesn't exist yet, write
      // an empty dataset to it. This is a bit of a hack to prevent the
      // approve and deny functions from raising a `FetchError`

      const accessRequest = decodeAccessRequestVC(requestVc);
      const resources =
        accessRequest.credentialSubject.hasConsent.forPersonalData;
      console.log(resources);

      const responses = [];
      for (let i = 0; i < resources.length; i += 1) {
        responses.push(createDatasetIfNotExists(solidSession, resources[i]));
      }
      await Promise.all(responses);

      if (consent === "yes") {
        const approvedVc = await approveAccessRequest(requestVcUrl, undefined, {
          fetch: solidSession.fetch,
        });
        res.redirect(`${redirectUrl}?accessGrantUrl=${approvedVc.id}`);
      }

      if (consent === "no") {
        const deniedVC = await denyAccessRequest(requestVcUrl, {
          fetch: solidSession.fetch,
        });
        res.redirect(`${redirectUrl}?accessGrantUrl=${deniedVC.id}`);
      }
    }
  }
}
