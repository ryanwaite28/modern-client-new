import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { CARMASTER_EVENT_TYPES } from 'projects/carmaster/src/app/enums/car-master.enum';
import { CarmasterService } from 'projects/carmaster/src/app/services/carmaster.service';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { SocketEventsService } from 'projects/common/src/app/services/socket-events.service';
import { UnseenService } from 'projects/common/src/app/services/unseen.service';
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

  MSG_MAX_LENGTH = 1000;
  messageForm = new FormGroup({
    body: new FormControl('', [Validators.pattern(/[^\s]+/gi), Validators.maxLength(this.MSG_MAX_LENGTH)])
  });

  socketCurrentMessagingEmitter?: any;

  socketTypingEmitter?: any;
  socketTypingStoppedEmitter?: any;
  typingTimeout?: any;

  newMessageSub?: Subscription;

  constructor(
    private userStore: UserStoreService,
    private carmasterService: CarmasterService,
    private alertService: AlertService,
    private socketEventsService: SocketEventsService,
    private route: ActivatedRoute,
    private unseenService: UnseenService
  ) { }

  ngOnInit() {
    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;
      this.getMessagings();
    });

    this.route.parent!.params.subscribe((params) => {
      this.currentParams = params;
    });

    this.newMessageSub = this.socketEventsService.listenToObservableEventStream(CARMASTER_EVENT_TYPES.NEW_CARMASTER_MESSAGE)
      .subscribe((event: any) => {
        this.handleMessageEvent(event);
      });
  }

  ngOnDestroy() {
    if (this.newMessageSub) {
      this.newMessageSub.unsubscribe();
    }
  }

  handleMessageEvent(event: any) {
    console.log(`new message event ctrl - admit one:`, event);
    // check if is currently selected messaging
    const isCurrentSelectedMessaging = (
      this.currentMessagingSelected &&
      event.messaging.id === this.currentMessagingSelected.id
    );
    if (isCurrentSelectedMessaging) {
      // the messages list is also reflecting the messaging; add the new message to the list
      this.messages_list.push(event.data);
      // the unseen service auto increments the count; decrement it since it is currently selected
      this.unseenService.decrement('messages', 1);
    } else {
      // check if there is an existing messaging in the list
      const messaging = this.messagings_list.find((m) => m.id === event.messaging.id);
      if (messaging) {
        // messaging found; user is not currently looking at it; update the unread count
        messaging.unread_messages_count++;
      } else {
        // no messaging found; this must be first in history; unshift to the list (latest by date)
        event.messaging.unread_messages_count = 1;
        this.messagings_list.unshift(event.messaging);
      }
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

  handleToRoomEvents(event: any) {
    if (event.from_user_id && event.from_user_id !== this.you!.id) {
      switch (event.event) {
        case CARMASTER_EVENT_TYPES.CARMASTER_MESSAGE_TYPING: {
          console.log('user is typing...');
          this.userIsTyping = true;
          break;
        }
        case CARMASTER_EVENT_TYPES.CARMASTER_MESSAGE_TYPING_STOPPED: {
          console.log('user stopped typing...');
          this.userIsTyping = false;
          break;
        }
      }
    }
  }

  unsetCurrentMessagingSelected() {
    this.messages_list_end = true;
    this.messages_list = [];
    
    if (this.socketCurrentMessagingEmitter) {
      const OLD_TO_ROOM = `${CARMASTER_EVENT_TYPES.TO_CARMASTER_MESSAGING_ROOM}:${this.currentMessagingSelected.id}`;
      this.socketCurrentMessagingEmitter.off(OLD_TO_ROOM);
      this.socketEventsService.emit(CARMASTER_EVENT_TYPES.LEAVE_TO_CARMASTER_MESSAGING_ROOM, {
        messaging_id: this.currentMessagingSelected.id
      });
    }
    this.currentMessagingSelected = null;
    this.socketCurrentMessagingEmitter = null;
  }

  setMessaging(messaging: any) {
    if (!messaging || messaging === this.currentMessagingSelected) {
      return;
    }
    
    this.messages_list_end = true;
    this.messages_list = [];
      
    if (this.socketCurrentMessagingEmitter) {
      const OLD_TO_ROOM = `${CARMASTER_EVENT_TYPES.TO_CARMASTER_MESSAGING_ROOM}:${this.currentMessagingSelected.id}`;
      this.socketCurrentMessagingEmitter.off(OLD_TO_ROOM);
      this.socketEventsService.emit(CARMASTER_EVENT_TYPES.LEAVE_TO_CARMASTER_MESSAGING_ROOM, {
        messaging_id: this.currentMessagingSelected.id
      });
    }
      
    this.currentMessagingSelected = messaging;
    const NEW_TO_ROOM = `${CARMASTER_EVENT_TYPES.TO_CARMASTER_MESSAGING_ROOM}:${this.currentMessagingSelected.id}`;
    console.log({ NEW_TO_ROOM });

    this.socketCurrentMessagingEmitter = this.socketEventsService.listenSocketCustom(NEW_TO_ROOM, (event) => {
      console.log(event);
      this.handleToRoomEvents(event);
    });
    this.socketEventsService.emit(CARMASTER_EVENT_TYPES.JOIN_TO_CARMASTER_MESSAGING_ROOM, {
      messaging_id: this.currentMessagingSelected.id
    });

    this.getMessages();
    this.unseenService.decrement('messages', messaging.unread_messages_count);
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
        let read_count = 0;
        for (const message of response.data) {
          this.messages_list.unshift(message);
          const isUnreadForYou = (
            message.to_id === this.you!.id &&
            message.opened === false
          );
          if (isUnreadForYou) {
            read_count++;
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
        // this.messages_list.push(response.data);
        this.messageForm.setValue({ body: '' });
        this.messageForm.get('body')!.markAsPristine();
        this.loading = false;
        // if (this.typingTimeout) {
        //   clearTimeout(this.typingTimeout);
        // }
        // setTimeout(() => {
        //   const TO_ROOM = `TO-MESSAGINGS:${this.currentMessagingSelected.id}`;
        //   this.socketEventsService.emit(TO_ROOM, {
        //     event: CARMASTER_EVENT_TYPES.MESSAGE_TYPING_STOPPED,
        //     messaging_id: this.currentMessagingSelected.id,
        //     from_user_id: this.you!.id,
        //     to_user_id: other_user.id
        //   });
        // }, 500);
        // this.typingTimeout = null;
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

    const TO_ROOM = CARMASTER_EVENT_TYPES.TO_CARMASTER_MESSAGING_ROOM;

    const startTimeout = () => {
      this.typingTimeout = setTimeout(() => {
        this.socketEventsService.emit(TO_ROOM, {
          event: CARMASTER_EVENT_TYPES.CARMASTER_MESSAGE_TYPING_STOPPED,
          messaging_id: this.currentMessagingSelected.id,
          from_user_id: this.you!.id,
          to_user_id: other_user.id
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

    this.socketEventsService.emit(TO_ROOM, {
      event: CARMASTER_EVENT_TYPES.CARMASTER_MESSAGE_TYPING,
      messaging_id: this.currentMessagingSelected.id,
      from_user_id: this.you!.id,
      to_user_id: other_user.id
    });
  }
}