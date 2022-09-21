export type Url = string;
export type WebId = Url;

export type Name = string;

export enum VouchRequestStatusStates {
  Successful = "successful",
  Unsuccessful = "unsuccessful",
  Pending = "pending",
}

export interface VouchRequest {
  voucher: WebId;
  vouchee: WebId;
  status: Url;
  name: Name;
  photo: Url;
  issued: Date;
  expires: Date;
  id: String;
}

export interface VouchRequestStatus {
  status: VouchRequestStatusStates;
  vouchRequest: Url;
}
