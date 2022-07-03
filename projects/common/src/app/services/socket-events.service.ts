import { Injectable } from '@angular/core';
import { io, Socket } from "socket.io-client";
import { UserStoreService } from '../stores/user-store.service';
import { Subscription, Subject, Observable, BehaviorSubject } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { COMMON_EVENT_TYPES, MODERN_APPS } from '../enums/all.enums';
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
  private socket?: Socket;

  private connect_event: any;
  private socket_id_event: any;
  private user_event: any;
  private disconnect_event: any;

  private socket_id?: string;
  private isListening = false;

  private userStoreSubscription: Subscription;

  private serviceIsReady = false;
  private serviceIsReadyStream = new BehaviorSubject<boolean>(this.serviceIsReady);

  // event streams
  private appEventStreamsMap: PlainObject<PlainObject<Subject<any>>> = {};
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

    
    this.userStoreSubscription = this.userStore.getChangesObs().subscribe((you: IUser | null) => {
      if (!this.you && you) {
        this.you = you;
        if (this.isListening === false) {
          this.isListening = true;
          console.log(`starting socket listener`);
          this.startListener();
        }
      }
    });
  }

  getServiceIsReady() {
    return this.serviceIsReadyStream.asObservable();
  }

  registerAppEventListenerStreams(app: MODERN_APPS, event_types_map: PlainObject) {
    if (!this.appEventStreamsMap[app]) {
      this.appEventStreamsMap[app] = {};
    }

    const event_types = Object.keys(event_types_map);

    for (const event_type of event_types) {
      this.appEventStreamsMap[app][event_type] = new Subject<any>();
  
      const listener = this.socket!.on(event_type, (event: any) => {
        console.log(`${event_type}`, { event });
        this.appEventStreamsMap[app][event_type].next(event);
      });
    }
  }

  private startListener() {
    const socket = io(this.clientService.DOMAIN, {});
    this.socket = socket;

    const connect_event = this.socket!.on('connect', () => {
      console.log(`socket connected. socket id: ${socket.id}`, event);
      this.socket_id = socket.id;
      const jwt = window.localStorage.getItem('rmw-modern-apps-jwt') || '';
      this.socket!.emit(`SOCKET_TRACK`, { jwt, user_id: this.you!.id });
    });

    const disconnect_event = this.socket!.on('disconnect', (event: any) => {
      console.log(`socket disconnected`, event);
    });
    
    this.connect_event = connect_event;
    this.disconnect_event = disconnect_event;

    this.serviceIsReady = true;
    this.serviceIsReadyStream.next(this.serviceIsReady);
  }

  private stopListener() {
    this.connect_event.disconnect();
    this.socket_id_event.disconnect();
    this.connect_event.disconnect();
    this.disconnect_event.disconnect();
    this.youConversationsSocketListeners = {};

    this.serviceIsReady = false;
    this.serviceIsReadyStream.next(this.serviceIsReady);
  }

  emit(eventName: string, data: any) {
    this.socket!.emit(eventName, data);
  }

  emitToRoom(params: {
    to_room: string,
    event_name: string,
    data: PlainObject,
  }) {
    this.socket!.emit(`EMIT_TO_ROOM`, params);
  }

  emitToUser(params: {
    user_id: number,
    event_name: string,
    data: PlainObject,
  }) {
    if (params.user_id === this.you.id) {
      throw new Error(`Cannot emit event to self`);
    }

    this.socket!.emit(`EMIT_TO_USER`, params);
  }

  joinRoom(room: string) {
    console.log(`socket id ${this.socket_id} joining room ${room}`, { room, socket_id: this.socket_id });
    this.socket!.emit(COMMON_EVENT_TYPES.SOCKET_JOIN_ROOM, { room });
  }

  leaveRoom(room: string) {
    console.log(`socket id ${this.socket_id} leaving room ${room}`, { room, socket_id: this.socket_id });
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

  listenToObservableEventStream<T>(app: MODERN_APPS, event_type: string) {
    const subjectStream = this.appEventStreamsMap[app][event_type];
    if (!subjectStream) {
      console.warn(`Unknown key for event stream: ${event_type}, creating new stream...`);
      this.appEventStreamsMap[app][event_type] = new Subject<any>();
      return this.appEventStreamsMap[app][event_type].asObservable() as Observable<T>;
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
