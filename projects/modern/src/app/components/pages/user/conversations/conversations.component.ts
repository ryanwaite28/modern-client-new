import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { COMMON_EVENT_TYPES } from 'projects/common/src/app/enums/all.enums';
import { PlainObject } from 'projects/common/src/app/interfaces/json-object.interface';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { ConversationsService } from 'projects/common/src/app/services/conversations.service';
import { SocketEventsService } from 'projects/common/src/app/services/socket-events.service';
import { UnseenService } from 'projects/common/src/app/services/unseen.service';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'common-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class UserConversationsComponent implements OnInit, OnDestroy {
  @ViewChild('conversationFormElm', { static: false }) conversationFormElm: ElementRef<HTMLFormElement> | any;
  
  conversationForm = new FormGroup({
    title: new FormControl('', [Validators.required])
  });

  you: IUser | any;
  user: IUser | any;
  currentParams: Params | any;
  currentConversationSelected: any;
  loading = false;
  isEditingCurrentConversationSelected = false;
  shouldShowAddingMemberForm = false;
  shouldShowMemberForm = false;
  search_results: any[] = [];

  conversations_map: PlainObject = {};
  conversations_list: any[] = [];
  conversation_members_list: any[] = [];
  conversation_messages_list: any[] = [];
  conversations_list_end = true;
  conversation_messages_list_end = true;
  
  // usersTyping: any[] = [];
  usersTypingMap: PlainObject = {};

  // socketTypingEmitter;
  // socketTypingStoppedEmitter;
  // socketMemberAddedEmitter;
  // socketMemberRemovedEmitter;
  // socketNewMessageEmitter;

  socketTypingEmittersMap: PlainObject = {};
  socketTypingStoppedEmittersMap: PlainObject = {};
  socketMemberAddedEmittersMap: PlainObject = {};
  socketMemberRemovedEmittersMap: PlainObject = {};
  socketConversationDeletedEmittersMap: PlainObject = {};
  socketNewMessageEmittersMap: PlainObject = {};

  typingTimeout: any;

  newConversationSub: Subscription | any;
  removedSub: Subscription | any;

  MSG_MAX_LENGTH = 1000;
  messageForm = new FormGroup({
    body: new FormControl('', [])
  });
  searchUsersForm = new FormGroup({
    name: new FormControl('', [])
  });
  searchUsersInputChanged = new Subject();

  constructor(
    private route: ActivatedRoute,
    private userStore: UserStoreService,
    private userService: UsersService,
    private alertService: AlertService,
    private socketEventsService: SocketEventsService,
    private conversationsService: ConversationsService,
    private unseenService: UnseenService,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe({
      next: (you: IUser | null) => {
        this.you = you;
        if (you) {
          this.getConversations();
        }
      }
    });

    this.route.parent!.params.subscribe((params) => {
      this.currentParams = params;
    });

    this.searchUsersForm.get('name')!.valueChanges.subscribe((value) => {
      this.searchUsersInputChanged.next(value);
    });

    this.newConversationSub = this.socketEventsService.listenToObservableEventStream(COMMON_EVENT_TYPES.CONVERSATION_MEMBER_ADDED).subscribe((event: any) => {
      this.handleMemberAddedEvent(event);
    });
    this.removedSub = this.socketEventsService.listenToObservableEventStream(COMMON_EVENT_TYPES.CONVERSATION_MEMBER_REMOVED).subscribe((event: any) => {
      this.handleMemberRemovedEvent(event);
    });

    this.searchUsersInputChanged.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe((query_term: any) => {
      this.search_users(query_term);
    });
  }

  ngOnDestroy() {
    if (this.newConversationSub) {
      this.newConversationSub.unsubscribe();
    }
    this.currentConversationSelected = null;
    this.conversations_list.forEach((c: any) => {
      try {
        this.removeListeners(c.conversation_id);
      } catch (e) {
        console.error(e);
      }
    });
  }

  handleMemberAddedEvent(event: any) {
    console.log(event);
    this.conversations_list.unshift(event.conversation);
    this.conversations_map[event.conversation.id] = event.conversation;
    this.addListeners(event.conversation.id);
  }

  handleMemberRemovedEvent(event: any) {
    console.log(event);
    const index = this.conversations_list.findIndex((c) => c.id === event.conversation_id);
    if (index !== -1) {
      this.conversations_list.splice(index, 1);
    }
    delete this.conversations_map[event.conversation_id];
    this.removeListeners(event.conversation_id);
  }

  getConversations() {
    const min_timestamp =
      this.conversations_list.length &&
      this.conversations_list[0].updated_at;
    this.conversationsService.get_user_conversations(
      this.you.id,
      null,
      true
    ).subscribe({
      next: (response: any) => {
        for (const conversation of response.data) {
          this.conversations_list.unshift(conversation);
          this.conversations_map[conversation.id] = conversation;
          this.usersTypingMap[conversation.id] = [];
          this.addListeners(conversation.id);
        }
        this.conversations_list_end = response.data.length < 5;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  setConversation(conversation: any) {
    if (conversation === this.currentConversationSelected) {
      return;
    }
    this.conversations_list_end = true;
    this.conversation_messages_list = [];
    // this.usersTyping = [];
    
    // if (this.currentConversationSelected) {
    //   this.removeListeners(this.currentConversationSelected.id);
    // }

    this.currentConversationSelected = conversation;

    // this.addListeners(this.currentConversationSelected.id);

    this.getConversationMessages();
    this.userService.update_conversation_last_opened(this.you.id, this.currentConversationSelected.id)
      .subscribe((response) => {
        console.log(`conversation last opened updated`, response);
      });

    // decrement unseen count by selected conversation's unseen count
    this.unseenService.decrement('conversations', conversation.unseen_messages_count);
  }

  addListeners(conversation_id: number) {
    this.socketEventsService.joinRoom(`conversation-${conversation_id}`);

    this.socketTypingEmittersMap[conversation_id] = this.socketEventsService.listenSocketCustom(
      COMMON_EVENT_TYPES.CONVERSATION_MESSAGE_TYPING,
      (event) => {
        console.log('member is typing...');
        if (this.you.id !== event.user.id) {
          if (!this.usersTypingMap) {
            this.usersTypingMap = {
              [conversation_id]: []
            };
          }

          this.usersTypingMap[conversation_id].push(event.user);
        }
      }
    );
    this.socketTypingStoppedEmittersMap[conversation_id] = this.socketEventsService.listenSocketCustom(
      COMMON_EVENT_TYPES.CONVERSATION_MESSAGE_TYPING_STOPPED,
      (event) => {
        console.log('member stopped typing...');
        const index = this.usersTypingMap[conversation_id].findIndex((u: any) => u.id === event.user.id);
        if (index !== -1) {
          this.usersTypingMap[conversation_id].splice(index, 1);
        }
      }
    );
    this.socketMemberAddedEmittersMap[conversation_id] = this.socketEventsService.listenSocketCustom(
      COMMON_EVENT_TYPES.CONVERSATION_MEMBER_ADDED,
      (event) => {
        console.log(event);
        if (this.shouldShowMemberForm) {
          this.conversation_members_list.push(event.data.member);
        }
      }
    );
    this.socketMemberRemovedEmittersMap[conversation_id] = this.socketEventsService.listenSocketCustom(
      COMMON_EVENT_TYPES.CONVERSATION_MEMBER_REMOVED,
      (event) => {
        console.log(event);
        if (this.shouldShowMemberForm) {
          const index = this.conversation_members_list.findIndex((m) => {
            return m.id === event.data.member.id && m.user.id === event.data.member.user.id
          });
          if (index !== -1) {
            this.conversation_members_list.splice(index, 1);
          }
        }
      }
    );
    this.socketNewMessageEmittersMap[conversation_id] = this.socketEventsService.listenSocketCustom(
      COMMON_EVENT_TYPES.NEW_CONVERSATION_MESSAGE,
      (event) => {
        this.handleMessageEvent(event);
      }
    );
    this.socketConversationDeletedEmittersMap[conversation_id] = this.socketEventsService.listenSocketCustom(
      COMMON_EVENT_TYPES.CONVERSATION_DELETED,
      (event) => {
        const index = this.conversations_list.findIndex((c) => c.id === event.data.conversation_id);
        if (index !== -1) {
          this.conversations_list.splice(index, 1);
        }
        this.removeListeners(event.data.conversation_id);
        if (event.data.conversation_id === this.currentConversationSelected.id) {
          this.currentConversationSelected = null;
        }
      }
    );
  }

  removeListeners(conversation_id: number, eventType?: COMMON_EVENT_TYPES)  {
    this.socketEventsService.leaveRoom(`conversation-${conversation_id}`);

    if (eventType) {
      if (this.socketTypingEmittersMap[conversation_id]) {
        this.socketTypingEmittersMap[conversation_id].off(`${eventType}:conversation-${conversation_id}`);
      }
      return;
    }

    if (this.socketTypingEmittersMap[conversation_id]) {
      this.socketTypingEmittersMap[conversation_id].off(`${COMMON_EVENT_TYPES.CONVERSATION_MESSAGE_TYPING}:conversation-${conversation_id}`);
    }
    if (this.socketTypingStoppedEmittersMap[conversation_id]) {
      this.socketTypingStoppedEmittersMap[conversation_id].off(`${COMMON_EVENT_TYPES.CONVERSATION_MESSAGE_TYPING_STOPPED}:conversation-${conversation_id}`);
    }
    if (this.socketMemberAddedEmittersMap[conversation_id]) {
      this.socketMemberAddedEmittersMap[conversation_id].off(`${COMMON_EVENT_TYPES.CONVERSATION_MEMBER_ADDED}:conversation-${conversation_id}`);
    }
    if (this.socketMemberRemovedEmittersMap[conversation_id]) {
      this.socketMemberRemovedEmittersMap[conversation_id].off(`${COMMON_EVENT_TYPES.CONVERSATION_MEMBER_REMOVED}:conversation-${conversation_id}`);
    }
    if (this.socketNewMessageEmittersMap[conversation_id]) {
      this.socketNewMessageEmittersMap[conversation_id].off(`${COMMON_EVENT_TYPES.NEW_CONVERSATION_MESSAGE}:conversation-${conversation_id}`);
    }
    if (this.socketConversationDeletedEmittersMap[conversation_id]) {
      this.socketNewMessageEmittersMap[conversation_id].off(`${COMMON_EVENT_TYPES.CONVERSATION_DELETED}:conversation-${conversation_id}`);
    }
  }

  handleMessageEvent(event: any) {
    console.log(`new message event ctrl - admit one:`, event);
    // check if is currently selected conversation
    const isCurrentSelectedMessaging = (
      this.currentConversationSelected &&
      event.data.conversation_id === this.currentConversationSelected.id
    );
    if (isCurrentSelectedMessaging) {
      // the messages list is also reflecting the conversation; add the new message to the list
      this.conversation_messages_list.push(event.data);
      // mark as seen 
      this.markMessageAsSeen(event.data);
      // the unseen service auto increments the count; decrement it since it is currently selected
      this.unseenService.decrement('conversations', 1);
    } else {
      // check if there is an existing messaging in the list
      const conversation = this.conversations_list.find((c) => c.id === event.data.conversation_id);
      if (conversation) {
        // messaging found; user is not currently looking at it; update the unread count
        conversation.unseen_messages_count++;
      } else {
        // no messaging found; this must be first in history; unshift to the list (latest by date)
        console.warn(`no conversation found`, { event, conversation }, this);
      }
    }
  }

  setEditingState() {
    if (!this.isEditingCurrentConversationSelected) {
      this.isEditingCurrentConversationSelected = true;
      this.conversationFormElm.nativeElement.title.value = this.currentConversationSelected.title;
      this.conversationForm.setValue({
        title: this.currentConversationSelected.title
      });
    } else {
      this.isEditingCurrentConversationSelected = false;
      this.conversationFormElm.nativeElement.reset();
      this.conversationForm.reset({
        title: ''
      });
    }
  }

  getConversationMessages() {
    const min_id =
      this.conversation_messages_list.length &&
      this.conversation_messages_list[0].id;
    this.conversationsService.get_conversation_messages(
      this.you.id,
      this.currentConversationSelected.id,
      min_id
    ).subscribe({
      next: (response: any) => {
        for (const message of response.data) {
          this.conversation_messages_list.unshift(message);
          this.markMessageAsSeen(message);
        }
        this.conversation_messages_list_end = response.data.length < 5;
        if (this.currentConversationSelected.hasOwnProperty('unseen_messages_count')) {
          this.currentConversationSelected.unseen_messages_count = 0;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  markMessageAsSeen(message: any) {
    this.conversationsService.mark_message_as_seen(
      this.you.id,
      this.currentConversationSelected.id,
      message.id
    ).subscribe({
      next: (response: any) => {
        message.seen = true;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  setAddingMembersState() {
    this.shouldShowMemberForm = false;
    if (this.shouldShowAddingMemberForm) {
      this.searchUsersForm.reset();
      this.search_results = [];
    }
    this.shouldShowAddingMemberForm = !this.shouldShowAddingMemberForm;
  }

  setRemovingMembersState() {
    this.shouldShowAddingMemberForm = false;
    if (this.shouldShowMemberForm) {
      this.conversation_members_list = [];
    } else {
      this.getConversationMembers();
    }
    this.shouldShowMemberForm = !this.shouldShowMemberForm;
  }

  getConversationMembers() {
    const min_id =
      this.conversation_members_list.length &&
      this.conversation_members_list[0].id;

    this.loading = true;
    this.conversationsService.get_conversation_members(
      this.you.id,
      this.currentConversationSelected.id,
      undefined,
      true
    ).subscribe({
      next: (response: any) => {
        this.conversation_members_list = response.data;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  createConversation(conversationFormElm: HTMLFormElement) {
    const formData = new FormData(conversationFormElm);
    this.loading = true;
    this.conversationsService.create_conversation(
      this.you.id,
      formData
    ).subscribe({
      next: (response: any) => {
        this.conversations_list.unshift(response.data);
        this.conversations_map[response.data.id] = response.data;
        this.usersTypingMap[response.data.id] = [];
        this.addListeners(response.data.id)
        conversationFormElm.reset();
        this.conversationForm.reset({
          title: ''
        });
        this.alertService.showSuccessMessage(response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  editConversation(conversationFormElm: HTMLFormElement) {
    const formData = new FormData(conversationFormElm);
    this.loading = true;
    this.conversationsService.update_conversation(
      this.you.id,
      this.currentConversationSelected.id,
      formData
    ).subscribe({
      next: (response: any) => {
        this.currentConversationSelected.title = response.data.title;
        this.currentConversationSelected.icon_link = response.data.icon_link;
        this.currentConversationSelected.icon_id = response.data.icon_id;

        conversationFormElm.reset();
        this.conversationForm.reset({
          title: ''
        });
        this.alertService.showSuccessMessage(response.message);
        this.isEditingCurrentConversationSelected = false;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  deleteConversation() {
    const ask = window.confirm(`Are you sure you want to delete this conversation? All messages will be lost for all users`);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.conversationsService.delete_conversation(
      this.you.id,
      this.currentConversationSelected.id
    ).subscribe({
      next: (response: any) => {
        const index = this.conversations_list.findIndex((c) => c.id === this.currentConversationSelected.id);
        if (index !== -1) {
          this.conversations_list.splice(index, 1);
        }
        this.removeListeners(this.currentConversationSelected.id);

        this.currentConversationSelected = null;
        this.alertService.showSuccessMessage(response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  search_users(query_term: string) {
    if (!query_term) {
      this.search_results = [];
      return;
    }
    this.loading = true;
    this.conversationsService.search_users(
      this.you.id,
      this.currentConversationSelected.id,
      query_term
    ).subscribe({
      next: (response: any) => {
        this.search_results = response.data;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  addConversationMember(user: IUser) {
    this.loading = true;
    this.conversationsService.add_conversation_member(
      this.you.id,
      this.currentConversationSelected.id,
      user.id
    ).subscribe({
      next: (response: any) => {
        const index = this.search_results.indexOf(user);
        if (index !== -1) {
          this.search_results.splice(index, 1);
        }
        if (this.conversations_map[this.currentConversationSelected.id].hasOwnProperty('members_count')) {
          this.conversations_map[this.currentConversationSelected.id].members_count++;
        }
        this.alertService.showSuccessMessage(response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  removeConversationMember(member: any) {
    this.loading = true;
    this.conversationsService.remove_conversation_member(
      this.you.id,
      this.currentConversationSelected.id,
      member.user.id
    ).subscribe({
      next: (response: any) => {
        if (this.conversations_map[this.currentConversationSelected.id].hasOwnProperty('members_count')) {
          this.conversations_map[this.currentConversationSelected.id].members_count--;
        }
        this.alertService.showSuccessMessage(response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  leaveConversation() {
    const ask = window.confirm(`Are you sure you want to leave this conversation?`);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.conversationsService.leave_conversation(
      this.you.id,
      this.currentConversationSelected.id
    ).subscribe({
      next: (response: any) => {
        const index = this.conversations_list.findIndex((c) => c.id === this.currentConversationSelected.id);
        if (index !== -1) {
          this.conversations_list.splice(index, 1);
        }
        this.removeListeners(this.currentConversationSelected.id);

        this.currentConversationSelected = null;
        this.alertService.showSuccessMessage(response.message);
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
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(() => {
        this.socketEventsService.emit(
          COMMON_EVENT_TYPES.CONVERSATION_MESSAGE_TYPING_STOPPED,
          { conversation_id: this.currentConversationSelected.id, user: this.you }
        );
        this.typingTimeout = null;
      }, 10000);
      return;
    }

    this.typingTimeout = setTimeout(() => {
      this.socketEventsService.emit(
        COMMON_EVENT_TYPES.CONVERSATION_MESSAGE_TYPING_STOPPED,
        { conversation_id: this.currentConversationSelected.id, user: this.you }
      );
      this.typingTimeout = null;
    }, 10000);

    this.socketEventsService.emit(
      COMMON_EVENT_TYPES.CONVERSATION_MESSAGE_TYPING,
      { conversation_id: this.currentConversationSelected.id, user: this.you }
    );
  }

  sendMessage() {
    if (this.loading) {
      return;
    }
    if (!this.messageForm.value.body.trim()) {
      return window.alert(`Message form cannot be empty`);
    }

    this.loading = true;
    this.conversationsService.create_conversation_message(
      this.you.id,
      this.currentConversationSelected.id,
      this.messageForm.value
    ).subscribe({
      next: (response: any) => {
        this.messageForm.setValue({ body: '' });
        this.messageForm.get('body')!.markAsPristine();
        this.loading = false;
        if (this.typingTimeout) {
          clearTimeout(this.typingTimeout);
        }
        this.socketEventsService.emit(
          COMMON_EVENT_TYPES.CONVERSATION_MESSAGE_TYPING_STOPPED,
          { conversation_id: this.currentConversationSelected.id, user: this.you }
        );
        this.typingTimeout = null;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
