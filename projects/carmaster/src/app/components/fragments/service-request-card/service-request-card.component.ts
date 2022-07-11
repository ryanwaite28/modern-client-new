import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertDivClass } from 'projects/common/src/app/enums/all.enums';
import { PlainObject } from 'projects/common/src/app/interfaces/json-object.interface';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { IFormSubmitEvent } from 'projects/common/src/app/interfaces/_common.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { GoogleMapsService } from 'projects/common/src/app/services/google-maps.service';
import { SocketEventsService } from 'projects/common/src/app/services/socket-events.service';
import { StripeService } from 'projects/common/src/app/services/stripe.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { IMechanicServiceRequest } from '../../../interfaces/carmaster.interface';
import { CarmasterService } from '../../../services/carmaster.service';

@Component({
  selector: 'carmaster-service-request-card',
  templateUrl: './service-request-card.component.html',
  styleUrls: ['./service-request-card.component.scss']
})
export class ServiceRequestCardComponent implements OnInit {
  @Input() you: IUser | any;
  @Input() service_request!: IMechanicServiceRequest;
  @Input() showEmbeddedContent: boolean = false;

  @Output() delete = new EventEmitter<any>();

  AlertDivClass = AlertDivClass;

  isEditing: boolean = false;
  loading: boolean = false;

  showDetails: boolean = false;
  showMessages: boolean = false;

  eventListeners: any[] = [];
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

  get service_requestStatusClassBox(): PlainObject {
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

  startEventListener() {
    
  }

  onSubmitEditServiceRequest(params: any | IFormSubmitEvent) {
    const msg = `Are all edits correct?`;
    const ask = window.confirm(msg);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.carmasterService.update_service_request(this.you!.id, this.service_request.id, params.formData).subscribe({
      next: (response: any) => {
        this.alertService.handleResponseSuccessGeneric(response);
        params.resetForm && params.resetForm();
        this.loading = false;
        this.service_request = response.data.service_request;
        this.isEditing = false;
      },
      error: (error: any) => {
        this.alertService.handleResponseErrorGeneric(error);
        this.loading = false;
      },
    });
  }

  deleteServiceRequest() {
    const ask = window.confirm(
      `Are you sure you want to delete this service request? This action cannot be undone.`
    );
    if (!ask) {
      return;
    }
    this.delete.emit();
  }

  sendServiceRequestMessage() {
    if (this.loading) {
      return;
    }
    if (!this.messageForm.value.body.trim()) {
      return window.alert(`Message form cannot be empty`);
    }

    this.loading = true;
    this.carmasterService.send_service_request_message(this.you!.id, this.service_request.id, this.messageForm.value).subscribe({
      next: (response: any) => {
        this.alertService.showSuccessMessage(response.message);
        this.service_request.mechanic_service_request_messages?.unshift(response.data);
        this.messageForm.setValue({ body: '' });
        this.messageForm.markAsPristine();
        this.messageForm.markAsUntouched();
        this.loading = false;
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
    this.carmasterService.pay_mechanic(this.you!.id, this.service_request.id).subscribe({
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.alertService.handleResponseErrorGeneric(error);
      },
      next: (response: any) => {
        this.loading = false;
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
      ).subscribe({
        next: (response: any) => {
          this.alertService.handleResponseSuccessGeneric(response);
          this.loading = false;
          this.service_request.datetime_work_started = response.data;
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.alertService.handleResponseErrorGeneric(error);
        },
        complete: () => {
          this.loading = false;
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
      ).subscribe({
        next: (response: any) => {
          this.alertService.handleResponseSuccessGeneric(response);
          this.loading = false;
          this.service_request.datetime_work_finished = response.data;
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.alertService.handleResponseErrorGeneric(error);
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}
