import { Blob } from "node:buffer";
import { VouchRequest } from "./vouch";

export type VerifiableCredentialType = "VerifiableCredential" | "VouchRequest";

export interface VouchRequestVC {
  "@context"?: string[];
  type?: VerifiableCredentialType[];
  request?: VouchRequest;
  [k: string]: unknown;
}

export type VerifiableCredentialPayloadType = VouchRequestVC;

export interface VouchArtifact {
  file: Blob;
  fileUri: string;
}
