import { IUser } from "projects/common/src/app/interfaces/user.interface";
import { ICommonModel } from "projects/common/src/app/interfaces/_common.interface";



export interface ICreateDeliveryProps {
  owner_id: number;

  title: string;
  description: string;

  item_image_link: string;
  item_image_id: string;

  from_location: string;
  from_address: string;
  from_street: string;
  from_city: string;
  from_state: string;
  from_zipcode: number;
  from_country: string;
  from_place_id: string;
  from_lat: number;
  from_lng: number;
  from_person: string;
  from_person_phone: string;
  from_person_email: string;
  from_person_id_required: boolean;
  from_person_sig_required: boolean;

  to_location: string;
  to_address: string;
  to_street: string;
  to_city: string;
  to_state: string;
  to_zipcode: number;
  to_country: string;
  to_place_id: string;
  to_lat: number;
  to_lng: number;
  to_person: string;
  to_person_phone: string;
  to_person_email: string;
  to_person_id_required: boolean;
  to_person_sig_required: boolean;

  category: string;
  size: string;
  weight: number;
  auto_accept_anyone: boolean;
  urgent: boolean;
  payout: number;
  penalty: number;
}

export interface ICreateDeliveryTrackingUpdateProps {
  user_id: number;
  delivery_id: number;

  icon_link?: string;
  icon_id?: string;
  message: string;
  carrier_lat: number;
  carrier_lng: number;
}





export interface IDelivery extends ICommonModel {
  owner_id: number,
  carrier_id: number,
  carrier_assigned_date: string,
  carrier_latest_lat: number | null,
  carrier_latest_lng: number | null,
  carrier_location_requested: boolean,
  carrier_location_request_completed: boolean
  carrier_shared_location: boolean,

  title: string,
  description: string,
  charge_id: string,
  payment_intent_id: string,
  payment_method_id: string,
  tags: string,
  item_image_link: string,
  item_image_id: string,
  
  from_location: string,
  from_address: string,
  from_street: string,
  from_city: string,
  from_state: string,
  from_zipcode: number,
  from_country: string,
  from_place_id: string,
  from_lat: number,
  from_lng: number,
  from_person: string,
  from_person_phone: string,
  from_person_email: string,
  from_person_id_required: boolean,
  from_person_sig_required: boolean,

  from_person_id_image_link: string,
  from_person_id_image_id: string,
  from_person_sig_image_link:  string,
  from_person_sig_image_id: string,

  to_location: string,
  to_address: string,
  to_street: string,
  to_city: string,
  to_state: string,
  to_zipcode: number,
  to_country: string,
  to_place_id: string,
  to_lat: number,
  to_lng: number,
  to_person: string,
  to_person_phone: string,
  to_person_email: string,
  to_person_id_required: boolean,
  to_person_sig_required: boolean,

  to_person_id_image_link: string,
  to_person_id_image_id: string,
  to_person_sig_image_link: string,
  to_person_sig_image_id: string,

  distance_miles: number,
  
  category: string,
  size: string,
  weight: number,
  featured: string,
  available: boolean,
  started: boolean,
  auto_accept_anyone: boolean,
  urgent: boolean,
  canceled: boolean,
  returned: boolean,
  completed: boolean,
  delivered_instructions: string,
  delivered_image_link: string,
  delivered_image_id: string,
  payment_session_id: string,
  payout: number,
  payout_invoice_id: string, // paypal
  penalty: number,
  penalty_invoice_id: string, // paypal

  datetime_pick_up_by: string,
  datetime_picked_up: string,
  datetime_picked_up_est: string,
  
  datetime_delivered: string,
  datetime_deliver_by: string,
  datetime_delivered_est: string,

  date_created: string,
  uuid: string,

  // includes
  owner?: IDeliverMeUser,
  carrier?: IDeliverMeUser,
  deliverme_delivery_tracking_updates?: IDeliveryTrackingUpdate[],
  delivery_messages?: IDeliveryMessage[],
  delivery_carrier_track_location_requests?: IDeliveryCarrierTrackLocationRequest[],
  delivery_carrier_track_location_updates?: IDeliveryCarrierTrackLocationUpdate[],
}

export interface IDeliverMeUser extends IUser  {
  deliverme_settings?: IDeliverMeUserSettings,
}

export interface IDeliverMeUserSettings extends ICommonModel  {
  user_id:             number,
  phone:               string,
  email:               string,
  cashapp_tag:         string,
  venmo_id:            string,
  paypal_me:           string,
  google_pay:          string,
}

export interface IDeliveryTransaction extends ICommonModel  {
  delivery_id:        number,
  action_type:        string,
  action_id:          string,
  status:             string,
}

export interface IDeliveryMessage extends ICommonModel  {
  delivery_id:        number,
  user_id:            number,
  body:               string,
  opened:             boolean,

  user?:              IUser;
}

export interface IDeliveryPayoutAttempts extends ICommonModel  {
  delivery_id:                 number,
  transaction_id:              string,
}

export interface IDeliveryPenaltyAttempt extends ICommonModel  {
  delivery_id:                 number,
  transaction_id:              string,
}

export interface IDeliveryRequest extends ICommonModel  {
  user_id:         number,
  delivery_id:     number,
  message:         string,
}

export interface IDeliveryDispute extends ICommonModel  {
  creator_id:      number,
  user_id:         number,
  delivery_id:     number,
  title:           string,
  status:          string,
}

export interface IDeliveryDisputeLog extends ICommonModel  {
  creator_id:      number,
  user_id:         number,
  delivery_id:     number,
  body:            string,
}

export interface IDeliveryTrackingUpdate extends ICommonModel  {
  delivery_id:       number,
  user_id:           number,
  message:           string,
  location:           string,
  carrier_lat:       number,
  carrier_lng:       number
  icon_link:         string,
  icon_id:           string,

  placeData:         any;
}

export interface IDeliveryCarrierTrackLocationRequest extends ICommonModel {
  id: number,
  delivery_id: number,
  status: string,
}

export interface IDeliveryCarrierTrackLocationUpdate extends ICommonModel {
  id: number,
  delivery_id: number,
  lat: number,
  lng: number,
}