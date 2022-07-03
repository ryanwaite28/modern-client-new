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

@Injectable({
  providedIn: 'root'
})
export class AppSocketEventsStateService {
  private you: IUser | any;

  private unseenNotificationsByApp: PlainObject<PlainObject<number>> = {};

  private changesByApp: PlainObject<BehaviorSubject<PlainObject<number>>> = {}; 
  private changesByAppEvent: PlainObject<PlainObject<BehaviorSubject<number>>> = {};

  // private changesFreezeByApp: PlainObject<boolean> = {}; 
  private changesFreezeByAppEvent: PlainObject<PlainObject<boolean>> = {}; 

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
      // this.eventsByApp[app] = new Subject<any>();
      this.changesByApp[app] = new BehaviorSubject<any>({});
      this.changesByAppEvent[app] = {};

      // this.changesFreezeByApp[app] = false;
      this.changesFreezeByAppEvent[app] = {};
    }

    eventsList.forEach((event_type) => {
      this.unseenNotificationsByApp[app][event_type] = 0;
      this.changesByAppEvent[app][event_type] = new BehaviorSubject<number>(this.unseenNotificationsByApp[app][event_type]);
      this.changesFreezeByAppEvent[app][event_type] = false;

      this.socketEventsService.listenToObservableEventStream(app, event_type).subscribe((event: any) => {
        console.log(event);
        // this.eventsByApp[app].next(event);
        this.increment(app, event_type, 1);
      });
    });
  }

  increment(app: MODERN_APPS, event_type: string, amount: number) {
    if (!event_type || !amount || !this.unseenNotificationsByApp[app].hasOwnProperty(event_type) || amount <= 0) {
      console.log(`could not increment:`, { app, event_type, amount });
      return;
    }

    // const appCanChange = this.appCanChange(app);
    const appEventCanChange = this.appEventCanChange(app, event_type);
    // const canChange = (appEventCanChange && appCanChange);

    if (appEventCanChange) {
      console.log(`AppSocketEventsStateService - increment:`, { app, event_type, amount });
      this.unseenNotificationsByApp[app][event_type] += amount;
      this.changesByApp[app].next({ ...this.unseenNotificationsByApp[app] });
      this.changesByAppEvent[app][event_type].next(this.unseenNotificationsByApp[app][event_type]);
    }
  }
  
  decrement(app: MODERN_APPS, event_type: string, amount: number) {
    if (!event_type || !amount || !this.unseenNotificationsByApp[app].hasOwnProperty(event_type) || amount <= 0) {
      console.log(`could not increment:`, { app, event_type, amount });
      return;
    }

    // const appCanChange = this.appCanChange(app);
    const appEventCanChange = this.appEventCanChange(app, event_type);
    // const canChange = (appEventCanChange && appCanChange);

    if (appEventCanChange) {
      console.log(`AppSocketEventsStateService - decrement:`, { app, event_type, amount });
      this.unseenNotificationsByApp[app][event_type] -= amount;
      this.changesByApp[app].next({ ...this.unseenNotificationsByApp[app] });
      this.changesByAppEvent[app][event_type].next(this.unseenNotificationsByApp[app][event_type]);
    }
  }

  clear (app: MODERN_APPS, event_type?: string) {
    if (event_type && this.unseenNotificationsByApp[app].hasOwnProperty(event_type)) {
      this.unseenNotificationsByApp[app][event_type] = 0;
      this.changesByApp[app].next({ ...this.unseenNotificationsByApp[app] });
      this.changesByAppEvent[app][event_type].next(this.unseenNotificationsByApp[app][event_type]);
    } 
    else {
      Object.keys(this.unseenNotificationsByApp[app]).forEach((event_type) => {
        this.unseenNotificationsByApp[app][event_type] = 0;
        this.changesByAppEvent[app][event_type].next(this.unseenNotificationsByApp[app][event_type]);
      });
      this.changesByApp[app].next({ ...this.unseenNotificationsByApp[app] });
    }
  }

  
  

  // appCanChange(app: MODERN_APPS) {
  //   return !this.changesFreezeByApp[app];
  // }

  appEventCanChange(app: MODERN_APPS, event_type: string) {
    return !this.changesFreezeByAppEvent[app][event_type];
  }

  // setAppChangeFreeze(app: MODERN_APPS, state: boolean) {
  //   this.changesFreezeByApp[app] = state;
  // }

  setAppEventChangeFreeze(app: MODERN_APPS, event_type: string, state: boolean) {
    console.log(`AppSocketEventsStateService.setAppEventChangeFreeze:`, { app, event_type, state });
    this.changesFreezeByAppEvent[app][event_type] = state;
  }

  getAppStateChanges(app: MODERN_APPS) {
    return this.changesByApp[app].asObservable();
  }

  getAppEventStateChanges(app: MODERN_APPS, event_type: string) {
    return this.changesByAppEvent[app][event_type].asObservable();
  }
}
