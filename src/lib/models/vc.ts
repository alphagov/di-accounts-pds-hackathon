import { VouchRequest} from "./vouch"
import { Blob } from "node:buffer";

export type VerifiableCredentialPayloadType =
 | VouchRequestVC

export type VerifiableCredentialType =
| "VerifiableCredential"
| "VouchRequest"

export interface VouchRequestVC {
  "@context"?: string[];
  type?: VerifiableCredentialType[];
  request?: VouchRequest
  [k: string]: unknown;
}

export interface VouchArtifact {
  file: Blob;
  fileUri: string;
}