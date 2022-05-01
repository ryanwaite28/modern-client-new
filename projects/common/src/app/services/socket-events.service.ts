import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { UserStoreService } from '../stores/user-store.service';
import { Subscription, Subject, Observable } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { COMMON_EVENT_TYPES } from '../enums/all.enums';
import { ClientService } from './client.service';
// import { ConversationsService } from './conversations.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UsersService } from './users.service';
import { PlainObject } from '../interfaces/json-object.interface';

@Injectable({
  providedIn: 'root'
})
export class SocketEventsService {
  private you: IUser | any;
  private socket?: SocketIOClient.Socket;

  private connect_event: any;
  private socket_id_event: any;
  private user_event: any;
  private disconnect_event: any;

  private socket_id?: string;

  private userStoreSubscription: Subscription;

  // event streams
  private streamsMap: { [key: string]: Subject<any>; } = {};
  private registrationIsReadyStream = new Subject<void>();

  // user's conversations
  private youConversationsSocketListeners: any = {};

  constructor(
    private clientService: ClientService,
    private userStore: UserStoreService,
    private usersService: UsersService,
    // private conversationsService: ConversationsService,
  ) {
    // Object.keys(COMMON_EVENT_TYPES).forEach((key) => {
    //   this.streamsMap[key] = new Subject<any>();
    // });

    const socket = io(this.clientService.DOMAIN);
    this.socket = socket;

    this.userStoreSubscription = this.userStore.getChangesObs().subscribe((you: IUser | null) => {
      // if user logs in, `you` will have value (is null by default).
      // once user logs in, start listening to event for user

      if (!this.you && you) {
        this.you = you;
        console.log(`starting socket listener`);
        this.startListener();
      }

      // user logged out, 
      // stop listening to events
      if (this.you && !you) {
        this.you = null;
        console.log(`stopping socket listener`);
        this.stopListener();
      }
    });
  }

  getRegistrationIsReady() {
    return this.registrationIsReadyStream.asObservable();
  }

  registerEventListenerStreams(event_types_map: PlainObject) {
    const listeners: SocketIOClient.Emitter[] = [];
    Object.keys(event_types_map).forEach((event_type) => {
      const subjectStream = new Subject<any>();
      this.streamsMap[event_type] = subjectStream;

      const listener = this.socket!.on(event_type, (event: any) => {
        console.log(`${event_type}`, { event });
        subjectStream.next(event);
      });
      listeners.push(listener);
    });
    return listeners;
  }

  private startListener() {
    const connect_event = this.socket!.on('connect', (event: any) => {
      console.log(`socket connected`, event);
      this.socket!.emit(`SOCKET_TRACK`, { user_id: this.you!.id });
    });
    const socket_id_event = this.socket!.on('socket_id', (event: any) => {
      console.log(`socket_id:`, event);
      this.socket_id = event;
    });
    const disconnect_event = this.socket!.on('disconnect', (event: any) => {
      console.log(`socket disconnected`, event);
    });
    const user_event = this.socket!.on(`FOR-USER:${this.you!.id}`, (event: any) => {
      this.handleEvent(event);
    });
    
    this.socket_id_event = socket_id_event;
    this.connect_event = connect_event;
    this.user_event = user_event;
    this.disconnect_event = disconnect_event;

    // this.listenToConversations();
  }

  private stopListener() {
    this.connect_event.disconnect();
    this.socket_id_event.disconnect();
    this.connect_event.disconnect();
    this.user_event.disconnect();
    this.disconnect_event.disconnect();
    this.youConversationsSocketListeners = {};
  }

  private handleEvent(event: any) {
    const subjectStream = this.streamsMap[event.event_type || event.event || event.eventName];
    console.log({ event, subjectStream });
    if (subjectStream) {
      subjectStream.next(event);
    }
  }

  emit(eventName: string, data: any) {
    this.socket!.emit(eventName, data);
  }

  joinRoom(room: string) {
    this.socket!.emit(COMMON_EVENT_TYPES.SOCKET_JOIN_ROOM, { room });
  }

  leaveRoom(room: string) {
    this.socket!.emit(COMMON_EVENT_TYPES.SOCKET_LEAVE_ROOM, { room });
  }

  // listen<T>(event_type: COMMON_EVENT_TYPES) {
  //   const subjectStream = this.streamsMap[event_type];
  //   if (!subjectStream) {
  //     console.warn(`Unknown key for event stream: ${event_type}, creating new stream...`);
  //     this.streamsMap[event_type] = new Subject<any>();
  //     return this.streamsMap[event_type].asObservable() as Observable<T>;
  //   }
  //   const observable = (<Observable<T>> subjectStream.asObservable());
  //   return observable;
  // }

  listenSocketCustom(event_type: string, call_back: (arg?: any) => any) {
    return this.socket!.on(event_type, call_back);
  }

  listenToObservableEventStream<T>(event_type: string) {
    const subjectStream = this.streamsMap[event_type];
    if (!subjectStream) {
      console.warn(`Unknown key for event stream: ${event_type}, creating new stream...`);
      this.streamsMap[event_type] = new Subject<any>();
      return this.streamsMap[event_type].asObservable() as Observable<T>;
    }
    const observable = (<Observable<T>> subjectStream.asObservable());
    return observable;
  }


  // private methods
  /*
  private listenToConversations(conversation_id?: number) {
    // add new listener
    if (conversation_id) {
      this.youConversationsSocketListeners[conversation_id] = this.listenCustom(
        COMMON_EVENT_TYPES.NEW_CONVERSATION_MESSAGE,
        (event: any) => {
          this.streamsMap[COMMON_EVENT_TYPES.NEW_CONVERSATION_MESSAGE].next(event);
        }
      );
      return;
    }

    // get all user's conversations and listen
    this.conversationsService.get_user_conversations(
      this.you!.id,
      null,
      true
    ).subscribe({
      next: (response: any) => {
        for (const conversation of response.data) {
          this.joinRoom(`conversation-${conversation.id}`);
          
          this.youConversationsSocketListeners[conversation.id] = this.listenCustom(
            COMMON_EVENT_TYPES.NEW_CONVERSATION_MESSAGE,
            (event: any) => {
              this.streamsMap[COMMON_EVENT_TYPES.NEW_CONVERSATION_MESSAGE].next(event);
            }
          );
        }
      },
      error: (error: HttpErrorResponse) => {
        // this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }
  */
}
