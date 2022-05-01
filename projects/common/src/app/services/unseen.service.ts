import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { COMMON_EVENT_TYPES } from '../enums/all.enums';
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
  private unseen: IUnseen = {
    messages: 0,
    conversations: 0,
    notifications: 0,
  };
  private changes = new BehaviorSubject<IUnseen>({
    messages: 0,
    conversations: 0,
    notifications: 0,
  });
  private userStoreSubscription: Subscription;

  private currentUrl: string = '';

  constructor(
    private alertService: AlertService,
    private userStore: UserStoreService,
    private userService: UsersService,
    private socketEventsService: SocketEventsService,
    private route: ActivatedRoute,
  ) {
    this.userStoreSubscription = this.userStore.getChangesObs().subscribe((you: IUser | null) => {
      // if user logs in, `you` will have value (is null by default).
      // once user logs in, start listening to event for user
      if (!this.you && you) {
        this.you = you;
        this.userService.get_unseen_counts(you.id).subscribe((response) => {
          this.unseen = {
            messages: response.data.unseen_messages,
            conversations: response.data.unseen_conversations,
            notifications: response.data.unseen_notifications,
          };
          this.changes.next({ ...this.unseen });
        });
      }

      // user logged out, 
      // stop listening to events
      if (this.you && !you) {
        this.you = null;
      }
    });

    const notification_events = [
      COMMON_EVENT_TYPES.NEW_RESOURCE_INTEREST,
      COMMON_EVENT_TYPES.NEW_CLIQUE_INTEREST,

      COMMON_EVENT_TYPES.CONVERSATION_MEMBER_ADDED,
      COMMON_EVENT_TYPES.CONVERSATION_MEMBER_REMOVED,

      COMMON_EVENT_TYPES.NEW_FOLLOWER,
      COMMON_EVENT_TYPES.NEW_UNFOLLOWER,

      COMMON_EVENT_TYPES.CLIQUE_MEMBER_LEFT,
      COMMON_EVENT_TYPES.CLIQUE_MEMBER_REQUEST,
      COMMON_EVENT_TYPES.CLIQUE_MEMBER_CANCEL,
      COMMON_EVENT_TYPES.CLIQUE_MEMBER_ACCEPT,
      COMMON_EVENT_TYPES.CLIQUE_MEMBER_DECLINE,

      COMMON_EVENT_TYPES.CONNECTION_DECLINE,
      COMMON_EVENT_TYPES.CONNECTION_ACCEPT,
      COMMON_EVENT_TYPES.CONNECTION_REQUEST,
      COMMON_EVENT_TYPES.CONNECTION_CANCEL,
      COMMON_EVENT_TYPES.CONNECTION_BROKEN,
    ];

    notification_events.forEach((event_type) => {
      this.socketEventsService.listenToObservableEventStream(event_type).subscribe((event: any) => {
        console.log(event);
        this.increment('notifications', 1);
      });
    });

    this.socketEventsService.listenToObservableEventStream(COMMON_EVENT_TYPES.NEW_MESSAGE).subscribe((event: any) => {
      this.increment('messages', 1);
    });

    this.socketEventsService.listenToObservableEventStream(COMMON_EVENT_TYPES.NEW_CONVERSATION_MESSAGE).subscribe((event: any) => {
      if (event.data.user_id !== this.you!.id) {
        this.increment('conversations', 1);
      }
    });
  }

  increment(prop: UnseenProp, amount: number) {
    if (!prop || !amount || !this.unseen.hasOwnProperty(prop) || amount <= 0) {
      console.log(`could not increment:`, { prop, amount });
      return;
    }
    this.unseen[prop] += amount;
    this.changes.next({ ...this.unseen });
  }
  
  decrement(prop: UnseenProp, amount: number) {
    if (!prop || !amount || !this.unseen.hasOwnProperty(prop) || amount <= 0) {
      console.log(`could not decrement:`, { prop, amount });
      return;
    }
    if (this.unseen[prop] === 0) {
      console.log(`cannot decrement into negative`);
      return;
    }
    this.unseen[prop] -= amount;
    this.changes.next({ ...this.unseen });
  }

  clear (prop?: UnseenProp) {
    if (prop && this.unseen.hasOwnProperty(prop)) {
      this.unseen[prop] = 0;
      this.changes.next({ ...this.unseen });
    } else {
      const clearState: IUnseen = {
        messages: 0,
        conversations: 0,
        notifications: 0,
      };
      this.unseen = clearState;
      this.changes.next({ ...clearState });
    }
  }

  getStateChanges() {
    return this.changes.asObservable();
  }
}
