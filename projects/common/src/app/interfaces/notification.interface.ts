import { IUser } from './user.interface';
import { ICommonModel } from './_common.interface';

export interface INotification extends ICommonModel {
  id: number;
  created_at: string;
  updated_at: string;
  //
  from_id: number;
  to_id: number;
  action: string;
  micro_app: string;
  target_type: string;
  target_id: number;
  message: string;
  link: string;
  read: boolean;
  image_link: string;
  image_id: string;
  date_created: string;
  uuid: string;
  //
  from?: IUser;
  to?: IUser;
}