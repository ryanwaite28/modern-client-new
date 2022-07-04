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

  private unseenEventsByApp: PlainObject<PlainObject<number>> = {};

  private tagByAppEvent: PlainObject<PlainObject<string>> = {};
  private appEventsByTag: PlainObject<PlainObject<PlainObject<boolean>>> = {};

  private changesByApp: PlainObject<BehaviorSubject<PlainObject<number>>> = {}; 
  private changesByAppEvent: PlainObject<PlainObject<BehaviorSubject<number>>> = {};
  private changesByAppEventTag: PlainObject<PlainObject<BehaviorSubject<PlainObject<number>>>> = {};

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
    if (!this.unseenEventsByApp[app]) {
      this.unseenEventsByApp[app] = {};
      this.tagByAppEvent[app] = {};

      this.changesByApp[app] = new BehaviorSubject<any>({});
      this.changesByAppEvent[app] = {};

      // this.changesFreezeByApp[app] = false;
      this.changesFreezeByAppEvent[app] = {};
    }

    eventsList.forEach((event_type) => {
      this.unseenEventsByApp[app][event_type] = 0;
      this.changesByAppEvent[app][event_type] = new BehaviorSubject<number>(this.unseenEventsByApp[app][event_type]);
      this.changesFreezeByAppEvent[app][event_type] = false;

      this.socketEventsService.listenToObservableEventStream(app, event_type).subscribe((event: any) => {
        console.log(event);
        // this.eventsByApp[app].next(event);
        this.increment(app, event_type, 1);
      });
    });
  }

  assignTagToAppEvents(app: MODERN_APPS, assignments: Array<{ event: string, tag: string }>) {
    console.log(`assignTagToAppEvents:`, { app, assignments });
    if (!this.tagByAppEvent[app]) {
      this.tagByAppEvent[app] = {};
    }
    for (const assignment of assignments) {
      this.tagByAppEvent[app][assignment.event] = assignment.tag;
      if (!this.appEventsByTag[app]) {
        this.appEventsByTag[app] = {};
      }
      if (!this.appEventsByTag[app][assignment.tag]) {
        this.appEventsByTag[app][assignment.tag] = {};
      }
      this.appEventsByTag[app][assignment.tag][assignment.event] = true;

      if (!this.changesByAppEventTag[app]) {
        this.changesByAppEventTag[app] = {};
      }
      if (!this.changesByAppEventTag[app][assignment.tag]) {
        const initialState = {
          [assignment.event]: !this.unseenEventsByApp[app] ? 0 : this.unseenEventsByApp[app][assignment.event] || 0,
        };
        this.changesByAppEventTag[app][assignment.tag] = new BehaviorSubject(initialState);
      }
    }
  }

  increment(app: MODERN_APPS, event_type: string, amount: number) {
    this.setIncrementDecrementInternal(app, event_type, amount, true);
  }
  
  decrement(app: MODERN_APPS, event_type: string, amount: number) {
    this.setIncrementDecrementInternal(app, event_type, amount, false);
  }

  private setIncrementDecrementInternal(app: MODERN_APPS, event_type: string, amount: number, increase: boolean) {
    if (!event_type || !amount || !this.unseenEventsByApp[app].hasOwnProperty(event_type) || amount <= 0) {
      console.log(`could not increment:`, { app, event_type, amount });
      return;
    }

    // const appCanChange = this.appCanChange(app);
    const appEventCanChange = this.appEventCanChange(app, event_type);
    // const canChange = (appEventCanChange && appCanChange);

    if (appEventCanChange) {
      console.log(`AppSocketEventsStateService - setIncrementDecrementInternal:`, { app, event_type, amount, increase });
      const newAmount = increase
        ? this.unseenEventsByApp[app][event_type] + amount
        : this.unseenEventsByApp[app][event_type] - amount;
      this.unseenEventsByApp[app][event_type] = newAmount;
      this.changesByApp[app].next({ ...this.unseenEventsByApp[app] });
      this.changesByAppEvent[app][event_type].next(this.unseenEventsByApp[app][event_type]);

      // get tag
      const tag: string = this.tagByAppEvent[app] && this.tagByAppEvent[app][event_type] || '';
      if (tag) {
        const state = this.getAppEventsStateByTag(app, tag);
        const tagStream = this.changesByAppEventTag[app][tag];
        tagStream.next(state);
      }
    }
  }

  clear (app: MODERN_APPS, event_type?: string) {
    if (event_type && this.unseenEventsByApp[app].hasOwnProperty(event_type)) {
      this.unseenEventsByApp[app][event_type] = 0;
      this.changesByApp[app].next({ ...this.unseenEventsByApp[app] });
      this.changesByAppEvent[app][event_type].next(this.unseenEventsByApp[app][event_type]);

    } 
    else {
      Object.keys(this.unseenEventsByApp[app]).forEach((event_type) => {
        this.unseenEventsByApp[app][event_type] = 0;
        this.changesByAppEvent[app][event_type].next(this.unseenEventsByApp[app][event_type]);
      });
      this.changesByApp[app].next({ ...this.unseenEventsByApp[app] });
    }

    const tag: string = this.tagByAppEvent[app] && this.tagByAppEvent[app][(event_type || '')] || '';
    if (tag) {
      const state = this.getAppEventsStateByTag(app, tag);
      const tagStream = this.changesByAppEventTag[app][tag];
      tagStream.next(state);
    }
  }
  
  
  getAppEventsStateByTag(app: MODERN_APPS, tag: string) {
    if (!this.appEventsByTag[app] || !this.appEventsByTag[app][tag]) {
      const msg = `app or tags not assigned/registered:`;
      console.warn(msg, this, { app, tag });
      throw new Error(msg);
    }
    const stateByTag: PlainObject<number> = {};
    let total = 0;
    const event_types = Object.keys(this.appEventsByTag[app][tag]);
    for (const event_type of event_types) {
      const state = this.unseenEventsByApp[app][event_type] || 0;
      stateByTag[event_type] = state;
      total = total + state;
    }
    stateByTag['total'] = total;
    return stateByTag;
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

  getAppEventTagChanges(app: MODERN_APPS, tag: string) {
    return this.changesByAppEventTag[app][tag].asObservable();
  }
}
