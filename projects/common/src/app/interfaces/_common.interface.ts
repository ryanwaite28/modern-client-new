import { ElementRef } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { REACTION_TYPES } from '../enums/all.enums';
import { HttpStatusCode } from '../enums/http-codes.enum';
import { PlainObject } from './json-object.interface';
import { IUser } from './user.interface';



export interface IUserNotificationsLastOpenedByApp extends ICommonModel {
  user_id:                             number,
  micro_app:                           string,
  notifications_last_opened:           string,
}

export interface IFormSubmitEvent {
  formData: FormData,
  payload: PlainObject,
  form: UntypedFormGroup,
  formElm: HTMLFormElement,
  resetForm?: () => void,
}

export interface IUserSubscriptionInfo {
  status: string,
  active: boolean,
  current_period_start: number,
  current_period_end: number,
}

export interface IReaction extends ICommonModel {
  name: string;
}

export interface IReactionsCounts {
  total_count: number;
  like_count: number;
  love_count: number;
  idea_count: number;
  confused_count: number;
}

export const ReactionsCountsPropByReactionType: PlainObject = {
  [REACTION_TYPES.LIKE]: 'like_count',
  [REACTION_TYPES.LOVE]: 'love_count',
  [REACTION_TYPES.IDEA]: 'idea_count',
  [REACTION_TYPES.CONFUSED]: 'confused_count',
};

export interface ICommonModel extends PlainObject {
  id:                      number,
  date_created:            string,
  uuid:                    string,
  created_at:              string,
  updated_at:              string,
  deleted_at:              string,
}



export interface IUserPaymentIntent extends ICommonModel {
  user_id:                             number,
  payment_intent_id:                   string,
  payment_intent_event:                string,
  micro_app:                           string,
  target_type:                         string,
  target_id:                           number,
  status:                              string,
}

export interface IUserPremiumSubscription extends ICommonModel {
  user_id:              number,
  billing_id:           string,
  product_id:           string,
  plan_id:              string,
  active:               boolean,
}

export interface IUserType extends ICommonModel {
  user_id:              number,
  type:                 string,
}

export interface IUsersEmailVerification extends ICommonModel {
  user_id:                 number,
  email:                   string,
  verification_code:       string,
  verified:                boolean,
}

export interface IUsersPhoneVerification extends ICommonModel {
  user_id:                 number,
  request_id:              string,
  phone:                   string,
  verification_code:       string,
}

export interface IUserPageView extends ICommonModel {
  user_id:             number,
  seen_id:             number,
}

export interface IModelRating extends ICommonModel {
  user_id:             number,
  writer_id:           number,
  rating:              number,
  title:               string,
  summary:             string,
}
export interface IUserRating extends IModelRating {}

export interface IUserReaction extends ICommonModel {
  owner_id:            number,
  user_id:             number,
  reaction_id:         number,
  reaction:            string,
}

export interface IResetPasswordRequest extends ICommonModel {
  user_id:             number,
  completed:           boolean,
  unique_value:        string,
}

export interface IContentSubscription extends ICommonModel {
  user_id:                    number,
  target_type:                string,
  target_id:                  number,
  target_action:              string,
  target_action_info:         string,
  frequency:                  string,
}

export interface IFollow extends ICommonModel {
  user_id:             number,
  follows_id:          number,
}

export interface IFollowRequest extends ICommonModel {
  user_id:             number,
  follows_id:          number,
}

export interface IBlocking extends ICommonModel {
  user_id:             number,
  blocks_id:           number,
}

export interface IAccountReported extends ICommonModel {
  user_id:             number,
  reporting_id:        number,
  issue_type:          string,
  details:             string,
}

export interface ISiteFeedback extends ICommonModel {
  user_id:             number,
  rating:              number,
  title:               string,
  summary:             string,
}

export interface IResetPasswordRequest extends ICommonModel {
  user_id:                 number,
  completed:               boolean,
  unique_value:            string,
}

export interface INotice extends ICommonModel {
  owner_id:            number,

  parent_id:           number,
  quote_id:            number,
  share_id:            number,

  body:                string,
  tags:                string,
  is_explicit:         boolean,
  is_private:          boolean,
  visibility:          string,
  last_edited:         string,
  date_created:        string,
  uuid:                string,
}

export interface IClique extends ICommonModel {
  creator_id:          number,
  title:               string,
  summary:             string,
  tags:                string,
  icon_link:           string,
  icon_id:             string,
  visibility:          string,
}

export interface IResource extends ICommonModel {
  owner_id:            number,
  resource_type:       string,
  tags:                string,
  title:               string,
  link:                string,
  icon_link:           string,
  icon_id:             string,
  description:         string,
  visibility:          string,
}

export interface IPhoto extends ICommonModel {
  owner_id:            number,
  caption:             string,
  photo_link:          string,
  photo_id:            string,
  is_explicit:         boolean,
  is_private:          boolean,
}

export interface IVideo extends ICommonModel {
  owner_id:            number,
  caption:             string,
  video_link:          string,
  video_id:            string,
  is_explicit:         boolean,
  is_private:          boolean,
}

export interface IRecipe extends ICommonModel {
  creator_id:          number,
  title:               string,
  description:         string,
  tags:                string,
  image_link:          string,
  youtube_link:        string,
  image_id:            string,
  visibility:          string,
}

export interface IAudio extends ICommonModel {
  owner_id:            number,
  caption:             string,
  audio_link:          string,
  audio_id:            string,
  is_explicit:         boolean,
  is_private:          boolean,
}

export interface IPost extends ICommonModel {
  owner_id:            number,
  title:               string,
  body:                string,
  tags:                string,
  is_explicit:         boolean,
  is_private:          boolean,
  visibility:          string,
  last_edited:         string,
}
export interface IPostViewer extends ICommonModel {
  owner_id:            number,
  user_id:             number,
  post_id:             number,
}
export interface IPostReaction extends ICommonModel {
  owner_id:            number,
  post_id:             number,
  reaction_id:         number,
  reaction:            string,
}

export interface IPostComment extends ICommonModel {
  owner_id:            number,
  post_id:             number,
  body:                string,
  last_edited:         string,
}
export interface IPostCommentReaction extends ICommonModel {
  owner_id:            number,
  comment_id:          number,
  reaction_id:         number,
  reaction:            string,
}

export interface IPostCommentReply extends ICommonModel {
  owner_id:            number,
  comment_id:          number,
  body:                string,
  last_edited:         string,
}
export interface IPostCommentReplyReaction extends ICommonModel {
  owner_id:            number,
  reply_id:            number,
  reaction_id:         number,
  reaction:            string,
}

export interface IContentSubscription extends ICommonModel {
  user_id:                 number,
  subscribes_to_id:        string,
  content_type:            string,
}

export interface IToken extends ICommonModel {
  user_id:                 number,
  device:                  string,
  token:                   string,
  ip_address:              string,
  user_agent:              string,
  date_created:            string,
  date_last_used:          string,
}

export interface IApiKey extends ICommonModel {
  user_id:             number | null,
  key:                 string,
  firstname:           string,
  middlename:          string,
  lastname:            string,
  email:               string,
  phone:               string,
  website:             string,
  subscription_plan:   string,

  user?: IUser;
}

export interface ApiKeyInvoice extends ICommonModel {
  key_id:              number,
  invoice_id:          number,
  status:              string,
}

export interface IApiKeyAllowedOrigin extends ICommonModel {
  key_id:              number,
  origin:              string,
}

export interface IApiKeyRequest extends ICommonModel {
  key_id:              number,
  request_url:         string,
  request_headers:     string,
  request_body:        string,
  resource:            string,
  response:            number,
  results:             string,
}



export interface ServiceMethodResultsInfo<T = any> {
  message?: string;
  data?: T;
  error?: any;
};

/**
 * @interface ServiceMethodResults
 * 
 * @description
 * Interface for a service method return value.
 * - status: uses an http code to signify result of action
 * - error: flag to indicate if there was an error
 * - info: object that serves as details about the results
 */
export type ServiceMethodResults<T = any> = {
  status: HttpStatusCode,
  error: boolean,
  info: ServiceMethodResultsInfo<T>,
};

export type ServiceMethodAsyncResults<T = any> = Promise<ServiceMethodResults<T>>;


export interface INavigatorGeoLocation {
  position: any,
  lat:  number,
  lng: number,
}

export interface IGoogleAutocompleteEvent {
  manage: PlainObject;
  placeData: PlainObject;
}