import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { CARMASTER_EVENT_TYPES } from 'projects/carmaster/src/app/enums/car-master.enum';
import { CarmasterService } from 'projects/carmaster/src/app/services/carmaster.service';
import { MODERN_APPS } from 'projects/common/src/app/enums/all.enums';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { SocketEventsService } from 'projects/common/src/app/services/socket-events.service';
import { AppSocketEventsStateService } from 'projects/common/src/app/services/app-socket-events-state.service';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'common-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class UserMessagesFragmentComponent implements OnInit, OnDestroy {
  you: IUser | any;
  user: IUser | any;

  currentParams: Params | any;
  currentMessagingSelected: any = null;
  loading = false;

  messagings_list: any[] = [];
  messages_list: any[] = [];
  messagings_list_end = true;
  messages_list_end = true;
  userIsTyping = false;

  MSG_MAX_LENGTH = 500;
  messageForm = new UntypedFormGroup({
    body: new UntypedFormControl('', [Validators.pattern(/[^\s]+/gi), Validators.maxLength(this.MSG_MAX_LENGTH)])
  });

  // socketCurrentMessagingEmitter?: any;
  // socketTypingEmitter?: any;
  // socketTypingStoppedEmitter?: any;

  typingTimeout?: any;

  newMessageSub?: Subscription;
  typingSub?: Subscription;
  typingStoppedSub?: Subscription;

  get currentToMessagingRoom(): string {
    const TO_ROOM = this.currentMessagingSelected
      ? `${CARMASTER_EVENT_TYPES.TO_CARMASTER_MESSAGING_ROOM}:${this.currentMessagingSelected.id}`
      : ``;
    return TO_ROOM;
  }

  constructor(
    private userStore: UserStoreService,
    private carmasterService: CarmasterService,
    private alertService: AlertService,
    private socketEventsService: SocketEventsService,
    private route: ActivatedRoute,
    private appSocketEventsStateService: AppSocketEventsStateService
  ) { }

  ngOnInit() {
    /*
      This page is managing the CARMASTER_EVENT_TYPES.NEW_CARMASTER_MESSAGE for as long as it is the current route
    */
    this.appSocketEventsStateService.setAppEventChangeFreeze(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.NEW_CARMASTER_MESSAGE, true);
    this.appSocketEventsStateService.setAppEventChangeFreeze(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.CARMASTER_MESSAGE_TYPING, true);
    this.appSocketEventsStateService.setAppEventChangeFreeze(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.CARMASTER_MESSAGE_TYPING_STOPPED, true);

    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;
      this.getMessagings();
    });

    this.route.parent!.params.subscribe((params) => {
      this.currentParams = params;
    });

    this.newMessageSub = this.socketEventsService.listenToObservableEventStream(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.NEW_CARMASTER_MESSAGE).subscribe({
      next: (event) => {
        console.log(`NEW_CARMASTER_MESSAGE`, event);
        this.handleMessageEvent(event);
      }
    });

    this.typingSub = this.socketEventsService.listenToObservableEventStream(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.CARMASTER_MESSAGE_TYPING).subscribe({
      next: (event) => {
        console.log(`CARMASTER_MESSAGE_TYPING`, event);
        this.userIsTyping = true;
      }
    });

    this.typingStoppedSub = this.socketEventsService.listenToObservableEventStream(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.CARMASTER_MESSAGE_TYPING_STOPPED).subscribe({
      next: (event) => {
        console.log(`CARMASTER_MESSAGE_TYPING_STOPPED`, event);
        this.userIsTyping = false;
      }
    });
  }

  ngOnDestroy() {
    /*
      Navigated away, unfreeze to return to normal behavior: app level listening to changes
    */
    this.appSocketEventsStateService.setAppEventChangeFreeze(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.NEW_CARMASTER_MESSAGE, false);
    this.appSocketEventsStateService.setAppEventChangeFreeze(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.CARMASTER_MESSAGE_TYPING, false);
    this.appSocketEventsStateService.setAppEventChangeFreeze(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.CARMASTER_MESSAGE_TYPING_STOPPED, false);

    this.newMessageSub?.unsubscribe();
    this.typingSub?.unsubscribe();
    this.typingStoppedSub?.unsubscribe();
  }

  handleMessageEvent(event: any) {
    // check if is currently selected messaging
    const isCurrentSelectedMessaging = (
      this.currentMessagingSelected &&
      event.messaging.id === this.currentMessagingSelected.id
    );

    if (isCurrentSelectedMessaging) {
      // already viewing messaging; mark new message as read
      this.messages_list.push(event.data);
      this.carmasterService.mark_message_as_read(this.you!.id, event.data.id).subscribe({
        next: (response) => {
          console.log(response);
        }
      });
    } 
    else {
      // check if there is an existing messaging in the list
      const messaging = this.messagings_list.find((m) => m.id === event.messaging.id);
      if (messaging) {
        // messaging found; user is not currently looking at it; update the unread count
        if (!messaging.hasOwnProperty(`unread_messages_count`)) {
          messaging.unread_messages_count = 1;
        }
        else {
          messaging.unread_messages_count++;
        }
      } 
      else {
        // no messaging found; this must be first in history; unshift to the list (latest by date)
        event.messaging.unread_messages_count = 1;
        this.messagings_list.unshift(event.messaging);
      }
      this.appSocketEventsStateService.increment(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.NEW_CARMASTER_MESSAGE, 1);
    }
  }

  getMessagings() {
    const min_timestamp =
      this.messagings_list.length &&
      this.messagings_list[0].updated_at;

    this.carmasterService.get_user_messagings(this.you!.id, undefined, true).subscribe({
      next: (response: any) => {
        for (const messaging of response.data) {
          this.messagings_list.unshift(messaging);
        }
        this.messagings_list_end = response.data.length < 5;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  unsetCurrentMessagingSelected() {
    this.messages_list_end = true;
    this.messages_list = [];
    
    const OLD_TO_ROOM = this.currentToMessagingRoom;
    this.currentMessagingSelected = null;
    this.userIsTyping = false;
    this.socketEventsService.leaveRoom(OLD_TO_ROOM);
  }

  setMessaging(messaging: any) {
    if (!messaging || messaging === this.currentMessagingSelected) {
      return;
    }
    
    this.messages_list_end = true;
    this.messages_list = [];
      
    this.currentMessagingSelected = messaging;
    const NEW_TO_ROOM = this.currentToMessagingRoom;
    console.log(`Joining:`, { NEW_TO_ROOM });
    this.socketEventsService.joinRoom(NEW_TO_ROOM);

    this.getMessages();
    // this.appSocketEventsStateService.decrement('messages', messaging.unread_messages_count);
  }

  getMessages() {
    const min_id =
      this.messages_list.length &&
      this.messages_list[0].id;
    const other_user = this.currentMessagingSelected.sender_id === this.you!.id
      ? this.currentMessagingSelected.user
      : this.currentMessagingSelected.sender
    this.carmasterService.get_user_messages(
      this.you!.id,
      other_user.id,
      min_id
    ).subscribe({
      next: (response: any) => {
        let unread_count = 0;
        for (const message of response.data) {
          this.messages_list.unshift(message);
          const isUnreadForYou = (
            message.to_id === this.you!.id &&
            message.opened === false
          );
          if (isUnreadForYou) {
            unread_count++;
          }
        }

        this.messages_list_end = response.data.length < 5;
        if (this.currentMessagingSelected.hasOwnProperty('unread_messages_count')) {
          // no need to keep track of how much messages were read. assume all have been read when user opens the messaging
          this.currentMessagingSelected.unread_messages_count = 0;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  sendMessage() {
    if (this.loading) {
      return;
    }
    if (!this.messageForm.value.body.trim()) {
      return window.alert(`Message form cannot be empty`);
    }

    const other_user = this.currentMessagingSelected.sender_id === this.you!.id
      ? this.currentMessagingSelected.user
      : this.currentMessagingSelected.sender

    this.loading = true;
    this.carmasterService.send_user_message(
      this.you!.id,
      other_user.id,
      this.messageForm.value
    ).subscribe({
      next: (response: any) => {
        this.messages_list.push(response.data.new_message);
        this.messageForm.setValue({ body: '' });
        this.messageForm.get('body')!.markAsPristine();

        if (this.typingTimeout) {
          clearTimeout(this.typingTimeout);
          this.typingTimeout = null;
        }

        this.socketEventsService.emitToRoom({
          to_room: this.currentToMessagingRoom,
          event_name: CARMASTER_EVENT_TYPES.CARMASTER_MESSAGE_TYPING_STOPPED,
          data: {
            event: CARMASTER_EVENT_TYPES.CARMASTER_MESSAGE_TYPING_STOPPED,
            messaging_id: this.currentMessagingSelected.id,
            from_user_id: this.you!.id,
            to_user_id: other_user.id
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  sendTypingSocketEvent() {
    const other_user = this.currentMessagingSelected.sender_id === this.you!.id
      ? this.currentMessagingSelected.user
      : this.currentMessagingSelected.sender;

    const to_room = this.currentToMessagingRoom;

    const startTimeout = () => {
      this.typingTimeout = setTimeout(() => {

        this.socketEventsService.emitToRoom({
          to_room,
          event_name: CARMASTER_EVENT_TYPES.CARMASTER_MESSAGE_TYPING_STOPPED,
          data: {
            event: CARMASTER_EVENT_TYPES.CARMASTER_MESSAGE_TYPING_STOPPED,
            messaging_id: this.currentMessagingSelected.id,
            from_user_id: this.you!.id,
            to_user_id: other_user.id
          }
        });
        this.typingTimeout = null;
      }, 5000);
    };

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      startTimeout();
      return;
    }

    startTimeout();

    this.socketEventsService.emitToRoom({
      to_room,
      event_name: CARMASTER_EVENT_TYPES.CARMASTER_MESSAGE_TYPING,
      data: {
        event: CARMASTER_EVENT_TYPES.CARMASTER_MESSAGE_TYPING,
        messaging_id: this.currentMessagingSelected.id,
        from_user_id: this.you!.id,
        to_user_id: other_user.id
      }
    });
  }
}