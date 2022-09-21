import { VouchRequest} from "./vouch"

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
