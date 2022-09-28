import {
  Url,
  WebId,
  Name,
  Base64EncodedString
} from "./common"

export enum VouchRequestStatusStates {
  Successful = "successful",
  Unsuccessful = "unsuccessful",
  Pending = "pending",
}

export interface VouchRequest {
  voucher: WebId;
  vouchee: WebId;
  name: Name;
  photo: Base64EncodedString;
  issued: Date;
  expires: Date;
  id: String;
}

export interface VouchRequestStatus {
  status: VouchRequestStatusStates;
  vouchRequest: Url;
}

export interface VouchedFor {
  vouchee: WebId;
  issued: Date;
  vouchResource: Url;
  vouchRequest: Url;
}

export interface RecievedVouchFrom {
  voucher: WebId;
  issued: Date;
  vouchForResource: Url;
  vouchRequest: Url;
}
