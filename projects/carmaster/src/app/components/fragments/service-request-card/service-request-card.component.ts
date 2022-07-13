import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertDivClass, MODERN_APPS } from 'projects/common/src/app/enums/all.enums';
import { PlainObject } from 'projects/common/src/app/interfaces/json-object.interface';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { IFormSubmitEvent } from 'projects/common/src/app/interfaces/_common.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { GoogleMapsService } from 'projects/common/src/app/services/google-maps.service';
import { SocketEventsService } from 'projects/common/src/app/services/socket-events.service';
import { StripeService } from 'projects/common/src/app/services/stripe.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { finalize, Subscription } from 'rxjs';
import { CARMASTER_EVENT_TYPES } from '../../../enums/car-master.enum';
import { IMechanicServiceRequest, IMechanicServiceRequestOffer } from '../../../interfaces/carmaster.interface';
import { CarmasterService } from '../../../services/carmaster.service';
import { service_categories_display_by_key } from '../../../utils/car-services.chamber';

@Component({
  selector: 'carmaster-service-request-card',
  templateUrl: './service-request-card.component.html',
  styleUrls: ['./service-request-card.component.scss']
})
export class ServiceRequestCardComponent implements OnInit, OnDestroy {
  @Input() you: IUser | any;
  @Input() service_request!: IMechanicServiceRequest;
  @Input() showEmbeddedContent: boolean = false;

  @Output() delete = new EventEmitter<any>();

  AlertDivClass = AlertDivClass;
  service_categories_display_by_key = service_categories_display_by_key;

  isEditing: boolean = false;
  loading: boolean = false;

  showDetails: boolean = false;
  showWorkFinishedImageModal: boolean = false;
  showMessages: boolean = false;

  subsList: Subscription[] = [];
  messageFormIsOpen = false;
  messages_list_end = false;
  MSG_MAX_LENGTH = 1000;
  messageForm = new FormGroup({
    body: new FormControl('', [
      Validators.required,
      // Validators.pattern(/(.*)+/),
      Validators.minLength(1),
      Validators.maxLength(this.MSG_MAX_LENGTH)
    ])
  });

  google: any;

  get isServiceRequestUser(): boolean {
    const match = !!this.you && !!this.service_request && this.you.id === this.service_request.user_id;
    return match;
  }

  get isServiceRequestMechanic(): boolean {
    const match = !!this.you && !!this.service_request && !!this.service_request.mechanic_id && this.you.id === this.service_request.mechanic_id;
    return match;
  }

  get isServiceRequestUserOrMechanic(): boolean {
    const match = !!this.you && !!this.service_request && (
      this.you.id === this.service_request.user_id ||
      this.you.id === this.service_request.mechanic_id
    );
    return match;
  }

  get serviceRequestStatusClassBox(): PlainObject {
    return {
      [AlertDivClass.success]: !!this.service_request.datetime_completed,
      [AlertDivClass.info]: !this.service_request.datetime_completed && !!this.service_request.mechanic_id,
      [AlertDivClass.secondary]: !this.service_request.datetime_completed && !this.service_request.mechanic_id,
    }
  }

  constructor(
    private userStore: UserStoreService,
    private alertService: AlertService,
    private carmasterService: CarmasterService,
    private googleMapsService: GoogleMapsService,
    private socketEventsService: SocketEventsService,
    private stripeService: StripeService,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe({
      next: (you) => {
        this.you = you;
      }
    });

    this.messages_list_end = !!this.service_request && this.service_request.mechanic_service_request_messages!.length < 5;
    if (!this.service_request) {
      console.warn(`service_request object not given...`, this);
      return;
    }

    if (!this.service_request.datetime_completed && this.isServiceRequestUserOrMechanic) {
      this.startEventListener();
    }
  }

  ngOnDestroy() {
    this.subsList.forEach(sub => sub.unsubscribe());
  }

  startEventListener() {
    const subsList: Subscription[] = [
      // for user
      this.socketEventsService.listenToObservableEventStream(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.NEW_SERVICE_REQUEST_OFFER).subscribe({
        next: (event) => {
          if (event.service_request_id === this.service_request.id) {
            this.service_request.service_request_offers!.push(event.data);
          }
        }
      }),
      this.socketEventsService.listenToObservableEventStream(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.SERVICE_REQUEST_OFFER_CANCELED).subscribe({
        next: (event) => {
          if (event.service_request_id === this.service_request.id) {
            const index = event.service_request_offer_id ? this.service_request.service_request_offers!.findIndex(offer => offer.id === event.service_request_offer_id) : -1;
            (index > -1) && this.service_request.service_request_offers!.splice(index, 1);
          }
        }
      }),
      this.socketEventsService.listenToObservableEventStream(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.SERVICE_REQUEST_WORK_STARTED).subscribe({
        next: (event) => {
          if (event.service_request_id === this.service_request.id) {
            this.service_request = event.data;
          }
        }
      }),
      this.socketEventsService.listenToObservableEventStream(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.SERVICE_REQUEST_WORK_FINISHED).subscribe({
        next: (event) => {
          if (event.service_request_id === this.service_request.id) {
            this.service_request = event.data;
          }
        }
      }),
      this.socketEventsService.listenToObservableEventStream(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.SERVICE_REQUEST_ADD_WORK_FINISHED_PICTURE).subscribe({
        next: (event) => {
          if (event.service_request_id === this.service_request.id) {
            this.service_request = event.data;
          }
        }
      }),


      // for mechanic
      this.socketEventsService.listenToObservableEventStream(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.SERVICE_REQUEST_COMPLETED).subscribe({
        next: (event) => {
          if (event.service_request_id === this.service_request.id) {
            this.service_request = event.data;
          }
        }
      }),


      // for both
      this.socketEventsService.listenToObservableEventStream(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.SERVICE_REQUEST_USER_CANCELED).subscribe({
        next: (event) => {
          if (event.service_request_id === this.service_request.id) {
            this.service_request = event.data;
          }
        }
      }),
      this.socketEventsService.listenToObservableEventStream(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.SERVICE_REQUEST_MECHANIC_CANCELED).subscribe({
        next: (event) => {
          if (event.service_request_id === this.service_request.id) {
            this.service_request = event.data;
          }
        }
      }),
      this.socketEventsService.listenToObservableEventStream(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.NEW_SERVICE_REQUEST_MESSAGE).subscribe({
        next: (event) => {
          if (event.service_request_id === this.service_request.id) {
            this.service_request.mechanic_service_request_messages?.push(event.data);
          }
        }
      }),
      
      /*
      this.socketEventsService.listenToObservableEventStream().subscribe({
        next: (event) => {
          if (event.service_request_id === this.service_request.id) {

          }
        }
      }),
      */
    ];

    this.subsList = subsList;
  }

  // onSubmitEditServiceRequest(params: any | IFormSubmitEvent) {
  //   const msg = `Are all edits correct?`;
  //   const ask = window.confirm(msg);
  //   if (!ask) {
  //     return;
  //   }
  //   this.loading = true;
  //   this.carmasterService.update_service_request(this.you!.id, this.service_request.id, params.formData).subscribe({
  //     next: (response: any) => {
  //       this.alertService.handleResponseSuccessGeneric(response);
  //       params.resetForm && params.resetForm();
  //       this.loading = false;
  //       this.service_request = response.data.service_request;
  //       this.isEditing = false;
  //     },
  //     error: (error: any) => {
  //       this.alertService.handleResponseErrorGeneric(error);
  //       this.loading = false;
  //     },
  //   });
  // }

  declineOffer(offer: IMechanicServiceRequestOffer) {
    this.loading = true;
    this.carmasterService.decline_service_request_offer(this.you!.id, offer.service_request_id, offer.id)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        const index = this.service_request.service_request_offers!.indexOf(offer);
        (index > -1) && this.service_request.service_request_offers!.splice(index, 1);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }
  
  acceptOffer(offer: IMechanicServiceRequestOffer) {
    this.loading = true;
    this.carmasterService.accept_service_request_offer(this.you!.id, offer.service_request_id, offer.id)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.service_request = response.data!.service_request;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  deleteServiceRequest() {
    this.delete.emit(this.service_request);
  }

  addWorkFinishedPicture(
    workFinishedPictureFormElm: HTMLFormElement,
    workFinishedPictureInput: HTMLInputElement
  ) {
    this.loading = true;
    const formData = new FormData(workFinishedPictureFormElm);
    this.carmasterService.add_work_finished_picture(
      this.service_request.mechanic_id!,
      this.service_request.id,
      formData
    ).subscribe({
      next: (response: any) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.loading = false;
        this.service_request.work_finished_image_id = response.data.image_id;
        this.service_request.work_finished_image_link = response.data.image_link;

        if (workFinishedPictureInput) {
          workFinishedPictureInput.value = '';
        }
      },
      error: (error: any) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  sendServiceRequestMessage() {
    if (this.loading) {
      return;
    }
    if (!this.messageForm.value.body.trim()) {
      return window.alert(`Message form cannot be empty`);
    }

    this.loading = true;
    this.carmasterService.send_service_request_message(this.you!.id, this.service_request.id, this.messageForm.value)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response: any) => {
        this.alertService.showSuccessMessage(response.message);
        this.service_request.mechanic_service_request_messages?.push(response.data);
        this.messageForm.setValue({ body: '' });
        this.messageForm.markAsPristine();
        this.messageForm.markAsUntouched();
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  payMechanic() {
    // https://stripe.com/docs/connect/collect-then-transfer-guide

    const ask = window.confirm(`Are you ready to pay the carrier?`);
    if (!ask) {
      return;
    }
    
    this.loading = true;
    this.carmasterService.pay_mechanic(this.you!.id, this.service_request.id)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      next: (response: any) => {
        this.service_request.datetime_completed = response.data;
        this.alertService.handleResponseSuccessGeneric(response);
      }
    });
  }

  markServiceRequestAsWorkStarted() {
    if (this.service_request.mechanic_id && this.you!.id === this.service_request.mechanic_id) {
      this.loading = true;
      this.carmasterService.mark_service_request_as_work_started(
        this.service_request.mechanic_id,
        this.service_request.id,
      )
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe({
        next: (response) => {
          this.alertService.handleResponseSuccessGeneric(response);
          response.data && (this.service_request = response.data);
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.handleResponseErrorGeneric(error);
        }
      });
    }
  }

  markServiceRequestAsWorkFinished() {
    if (this.service_request.mechanic_id && this.you!.id === this.service_request.mechanic_id) {
      this.loading = true;
      this.carmasterService.mark_service_request_as_work_finished(
        this.service_request.mechanic_id,
        this.service_request.id,
      )
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe({
        next: (response: any) => {
          this.alertService.handleResponseSuccessGeneric(response);
          response.data && (this.service_request = response.data);
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.handleResponseErrorGeneric(error);
        }
      });
    }
  }
}
