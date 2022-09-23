import { Session } from "@inrupt/solid-client-authn-node";
import {
  getPodUrlAll,
  overwriteFile,
  getSourceUrl,
  SolidDataset,
  getSolidDataset,
  createSolidDataset,
} from "@inrupt/solid-client";

import { buildVouchRequestVC } from "../lib/vouchRequestVC"

import SessionError from "../errors";

// We need to explicitly import the Node.js implementation of 'Blob' here
// because it's not a global in Node.js (whereas it is global in the browser).
// We may also need to explicitly convert our usage of 'Blob' into a Buffer
// instead of using it as a 'Blob', because the Node.js 'Blob' implementation
// has no 'stream()' method, whereas the browser implementation does -
// otherwise using one instance where the other is expected will throw an
// error like this:
//   error TS2345: Argument of type 'Blob' is not assignable to parameter of type 'Blob | Buffer'.
//     Type 'import("buffer").Blob' is not assignable to type 'Blob'.
//       The types returned by 'stream()' are incompatible between these types.
//         Type 'unknown' is not assignable to type 'ReadableStream<any>'.
// Both the Node.js and the browser implementations of 'Blob' support the
// '.arrayBuffer()' method, and the `solid-client-js` functions that expect
// 'Blob's (like `overwriteFile()`) can accept both native 'Blob's and
// 'Buffer's, so always converting any 'Blob' instances we have into 'Buffer's
// allows those functions to work safely with both Node.js and browser
// 'Blob's.
import { Blob } from "node:buffer";

export async function getVouchContainer(webId: string, uuid: string) {
  const pod = (await getPodUrlAll(webId))[0];

  return `${pod}/${uuid}/`;
}

export async function getPhotoUrl(webId: string) {
  const pod = (await getPodUrlAll(webId))[0];
  return `${pod}/photo`;
}

export async function getNameUrl(webId: string) {
  const pod = (await getPodUrlAll(webId))[0];
  return `${pod}/fullName`;
}

export async function getOrCreateDataset(
  session: Session,
  datasetUri: string
): Promise<SolidDataset> {
  try {
    const dataset = await getSolidDataset(datasetUri, { fetch: session.fetch });
    return dataset;
  } catch (fetchError) {
    const dataset = createSolidDataset();
    return dataset;
  }
}

export async function getDatasetUri(session: Session, containerPath: string) {
  if (session.info.webId && containerPath) {
    const podUri = await getPodUrlAll(session.info.webId, {
      fetch: session.fetch,
    });
    return `${podUri[0]}${containerPath}`;
  }
  throw new SessionError();
}

// Upload File to the targetFileURL.
// If the targetFileURL exists, overwrite the file.
// If the targetFileURL does not exist, create the file at the location.
export async function writeFileToPod(
  file: Blob,
  targetFileURL: string,
  session: Session
) {
  try {
    const savedFile = await overwriteFile(
      targetFileURL, // URL for the file.
      // We need to explicitly convert our 'Blob' into a Buffer here (see
      // detailed comment on our 'import { Blob }' code above).
      Buffer.from(await file.arrayBuffer()),
      { contentType: file.type, fetch: session.fetch } // mimetype if known, fetch from the authenticated session
    );
    console.log(`File saved at ${getSourceUrl(savedFile)}`);
  } catch (error) {
    console.error(error);
  }
}

export async function createVcBlob(
  session: CookieSessionInterfaces.CookieSessionObject,
): Promise<Blob> {
  return new Blob([await buildVouchRequestVC(session)], {
    type: "application/text",
  });
}

