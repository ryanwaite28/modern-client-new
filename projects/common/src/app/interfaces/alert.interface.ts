import { AlertTypes } from '../enums/all.enums';

export interface IAlert {
  type: AlertTypes;
  message: string;
}
