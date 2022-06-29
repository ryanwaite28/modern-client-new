import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { COMMON_EVENT_TYPES, MODERN_APPS } from '../enums/all.enums';
import { PlainObject } from '../interfaces/json-object.interface';
import { IUser } from '../interfaces/user.interface';
import { UserStoreService } from '../stores/user-store.service';
import { getUserFullName } from '../_misc/chamber';
import { AlertService } from './alert.service';
import { SocketEventsService } from './socket-events.service';
import { UsersService } from './users.service';

/**
 * Get and tracks user's unseen information (global state/store), this includes:
 * - messages
 * - conversations
 * - notifications
 */

export interface IUnseen {
  messages: number;
  conversations: number;
  notifications: number;
}

export type UnseenProp =
  'messages' |
  'conversations' |
  'notifications';

@Injectable({
  providedIn: 'root'
})
export class UnseenService {
  private you: IUser | any;

  private unseenNotificationsByApp: PlainObject = {};

  private eventsByApp: PlainObject<Subject<any>> = {}; 
  private changesByApp: PlainObject<BehaviorSubject<any>> = {}; 

  constructor(
    private alertService: AlertService,
    private userStore: UserStoreService,
    private userService: UsersService,
    private socketEventsService: SocketEventsService,
    private route: ActivatedRoute,
  ) {}

  registerEvents(app: MODERN_APPS, eventsList: Array<string>) {
    console.log(`registering events for:`, { app, eventsList });
    if (!this.unseenNotificationsByApp[app]) {
      this.unseenNotificationsByApp[app] = {};
      this.eventsByApp[app] = new Subject<any>();
      this.changesByApp[app] = new BehaviorSubject<any>({});
    }

    eventsList.forEach((event_type) => {
      this.unseenNotificationsByApp[app][event_type] = 0;
      this.socketEventsService.listenToObservableEventStream(event_type).subscribe((event: any) => {
        console.log(event);
        this.eventsByApp[app].next(event);
        this.increment(app, event_type, 1);
      });
    });
  }

  increment(app: MODERN_APPS, prop: string, amount: number) {
    if (!prop || !amount || !this.unseenNotificationsByApp[app].hasOwnProperty(prop) || amount <= 0) {
      console.log(`could not increment:`, { prop, amount });
      return;
    }
    this.unseenNotificationsByApp[app] += amount;
    this.changesByApp[app].next({ ...this.unseenNotificationsByApp[app] });
  }
  
  decrement(app: MODERN_APPS, prop: string, amount: number) {
    if (!prop || !amount || !this.unseenNotificationsByApp[app].hasOwnProperty(prop) || amount <= 0) {
      console.log(`could not increment:`, { prop, amount });
      return;
    }
    this.unseenNotificationsByApp[app] -= amount;
    this.changesByApp[app].next({ ...this.unseenNotificationsByApp[app] });
  }

  clear (app: MODERN_APPS, prop?: string) {
    if (prop && this.unseenNotificationsByApp[app].hasOwnProperty(prop)) {
      this.unseenNotificationsByApp[app][prop] = 0;
      this.changesByApp[app].next({ ...this.unseenNotificationsByApp[app] });
    } 
    else {
      Object.keys(this.unseenNotificationsByApp[app]).forEach((event_type) => {
        this.unseenNotificationsByApp[app][event_type] = 0;
      });
      this.changesByApp[app].next({ ...this.unseenNotificationsByApp[app] });
    }
  }

  getAppEvents(app: MODERN_APPS) {
    return this.eventsByApp[app].asObservable();
  }

  getAppStateChanges(app: MODERN_APPS) {
    return this.changesByApp[app].asObservable();
  }
}
