import { Pipe, PipeTransform } from '@angular/core';
import { INotification } from '../interfaces/notification.interface';
import { getFullNotificationMessage } from '../_misc/chamber';

@Pipe({
  name: 'notificationAction'
})
export class NotificationActionPipe implements PipeTransform {

  constructor() { }

  transform(notification: INotification): any {
    return getFullNotificationMessage(notification);
  }
}
