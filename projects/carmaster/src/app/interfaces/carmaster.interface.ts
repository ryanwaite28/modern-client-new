import { IUser } from "projects/common/src/app/interfaces/user.interface";
import { ICommonModel } from "projects/common/src/app/interfaces/_common.interface";


export interface IMechanic extends ICommonModel {
  user_id: number,
  bio: string,
  website: string,
  phone: string,
  email: string,
  city: string,
  state: string,
  zipcode: number,
  country: string,

  user?: IUser,
  mechanic_fields?: IMechanicField[],
  mechanic_credentials?: IMechanicCredential[],
  mechanic_ratings?: IMechanicRating[],
  mechanic_expertises?: IMechanicExpertise[],
  mechanic_services?: IMechanicService[],
  mechanic_service_requests?: IMechanicServiceRequest[],
  mechanic_offers?: IMechanicServiceRequestOffer[],
}

export interface IMechanicFavorite extends ICommonModel {
  user_id: number,
  mechanic_id: number,
  
  user?: IUser,
  mechanic?: IMechanic,
}

export interface IMechanicField extends ICommonModel {
  mechanic_id: number,
  fieldname: string,
  fieldtype: string,
  fieldvalue: string,
  is_link: boolean,

  mechanic?: IMechanic,
}

export interface IMechanicCredential extends ICommonModel {
  mechanic_id: number,
  title: string,
  website: string,
  description: string,
  image_link: string,
  image_id: string,

  mechanic?: IMechanic,
  credential_expertises?: IMechanicExpertise[],
  mechanic_credential_reportings?: IMechanicCredentialReporting[],
}

export interface IMechanicCredentialReporting extends ICommonModel {
  user_id: number,
  credential_id: number,
  issue: string,
}

export interface IMechanicCredentialReportingMessage extends ICommonModel {
  reporting_id: number,
  user_id: number,
  body: string,
  opened: boolean,

  user?: IUser,
}

export interface IMechanicRating extends ICommonModel {
  writer_id: number,
  mechanic_id: number,
  rating: number,
  title: string,
  summary: string,

  writer?: IUser,
  mechanic?: IMechanic,
  mechanic_rating_edits?: IMechanicRatingEdit[],
}

export interface IMechanicRatingEdit extends ICommonModel {
  rating_id: number,
  summary: string,

  rating?: IMechanicRating,
}

export interface IMechanicExpertise extends ICommonModel {
  mechanic_id: number,
  credential_id: number,
  description: string,
  make: string,
  model: string,
  type: string,
  trim: string,
  min_year: number,
  max_year: number,

  credential?: IMechanicCredential,
  mechanic?: IMechanic,
}

export interface IMechanicService extends ICommonModel {
  mechanic_id: number,
  expertise_id: number | null,
  service_category: string,
  service_type: string,
  service_action: string,
  description: string,
  cost: number,

  mechanic?: IMechanic,
  expertise?: IMechanicExpertise,
}

export interface IMechanicServiceRequest extends ICommonModel {
  user_id: number,
  mechanic_id: number | null,
  service_id: number | null,
  payment_method_id: string,
  payment_intent_id: string,
  image_link: string,
  image_id: string,
  work_finished_image_link: string,
  work_finished_image_id: string,
  
  service_category: string,
  service_type: string,
  service_action: string,
  make: string,
  model: string,
  type: string,
  trim: string,
  year: number,
  city: string,
  state: string,
  zipcode: number,
  country: string,
  
  title: string,
  description: string,
  payout: number,
  notes: string,

  datetime_needed: string,
  datetime_canceled: string,
  datetime_accepted: string,
  datetime_declined: string,
  datetime_work_started: string,
  datetime_work_finished: string,
  datetime_completed: string,
  status: string,
  
  user?: IUser,
  mechanic?: IMechanic,
  service?: IMechanicService,
  service_request_offers?: IMechanicServiceRequestOffer[];
  mechanic_service_request_messages?: IMechanicServiceRequestMessage[];
}

export interface IMechanicServiceRequestOffer extends ICommonModel {
  service_request_id: number,
  service_request_user_id: number,
  mechanic_id: number,
  notes: string,
  status: string,

  user?: IUser,
  mechanic?: IMechanic,
  service_request?: IMechanicServiceRequest,
}

export interface IMechanicServiceRequestMessage extends ICommonModel {
  service_request_id: number,
  user_id: number,
  body: string,
  opened: boolean,

  user?: IUser,
  service_request?: IMechanicServiceRequest,
}

export interface IMechanicServiceRequestDispute extends ICommonModel {
  creator_id: number,
  service_request_id: number,
  title: string,
  description: string,
  status: string,

  creator?: IUser,
  service_request?: IMechanicServiceRequest,
  mechanic_service_request_dispute_logs?: IMechanicServiceRequestDisputeLog[],
}

export interface IMechanicServiceRequestDisputeLog extends ICommonModel {
  creator_id: number,
  dispute_id: number,
  body: string,
  image_link: string,
  image_id: string,

  creator?: IUser,
  dispute?: IMechanicServiceRequestDispute,
}