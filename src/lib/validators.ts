import {
  AccessRequest
} from "@inrupt/solid-client-access-grants";

export function validateAccessRequestVC(decodedVC: AccessRequest): true | false {
  // Not implimented but left here as a hint that this is logic we'd need for
  // a production service, we should validate the
  const notImplimented = true;

  if (notImplimented) {
    return true;
  }

  const err = "VC is invalid in some way";
  console.log(err);
  console.log(decodedVC);

  return false;
}

export const isAccessRequest = (vc: any): vc is AccessRequest =>
  typeof vc === "object" && "credentialSubject" in vc;

export const isString = (jwt: any): jwt is string => typeof jwt === "string";
