import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CARMASTER_EVENT_TYPES } from 'projects/carmaster/src/app/enums/car-master.enum';
import { service_categories_display_by_key } from 'projects/carmaster/src/app/utils/car-services.chamber';
import { COMMON_STATUSES, MODERN_APPS } from 'projects/common/src/app/enums/all.enums';
import { PlainObject } from 'projects/common/src/app/interfaces/json-object.interface';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { IFormSubmitEvent } from 'projects/common/src/app/interfaces/_common.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { SocketEventsService } from 'projects/common/src/app/services/socket-events.service';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { combineLatest, finalize, map, mergeMap, Subscription } from 'rxjs';
import { IMechanic, IMechanicServiceRequest, IMechanicServiceRequestOffer } from '../../../../interfaces/carmaster.interface';
import { CarmasterService } from '../../../../services/carmaster.service';

@Component({
  selector: 'carmaster-service-request-search',
  templateUrl: './service-request-search.component.html',
  styleUrls: ['./service-request-search.component.scss']
})
export class ServiceRequestSearchComponent implements OnInit {
  you: IUser | null = null;
  mechanic_profile: IMechanic | null = null;
  loading = false;
  service_requests: IMechanicServiceRequest[] = [];
  is_subscription_active = false;

  MSG_MAX_LENGTH = 1000;
  messageFormsByUserId: PlainObject<UntypedFormGroup> = {};
  service_categories_display_by_key = service_categories_display_by_key;
  offerByServiceRequestId: PlainObject<IMechanicServiceRequestOffer | undefined> = {};
  subsList: Subscription[] = [];

  constructor(
    private userStore: UserStoreService,
    private userService: UsersService,
    private carmasterService: CarmasterService,
    private alertService: AlertService,
    private socketEventsService: SocketEventsService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.userStore.getChangesObs()
    ])
    .pipe(mergeMap((values) => {
      this.you = values[0];
      this.is_subscription_active = this.userService.getHasPlatformSubscription(); 
      return this.carmasterService.get_mechanic_by_user_id(this.you!.id)
    }))
    .pipe(map((response) => {
      this.mechanic_profile = response.data || null;
    }))
    .subscribe({
      next: () => {
        console.log(this);
      }
    });
  }

  ngOnDestroy() {
    this.subsList.forEach(sub => sub.unsubscribe());
  }

  searchServiceRequests($event: IFormSubmitEvent) {
    this.loading = true;
    this.carmasterService.search_service_requests($event.payload)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.service_requests = response.data!;
        if (!this.service_requests.length) {
          this.alertService.showWarningMessage(`No results...`);
          return;
        }

        const messageFormsByUserId: PlainObject<UntypedFormGroup> = {};
        for (const service_request of this.service_requests) {
          const yourOffer = service_request.service_request_offers!.find(offer => offer.mechanic!.user_id === this.you!.id && offer.status === COMMON_STATUSES.PENDING);
          this.offerByServiceRequestId[service_request.id] = yourOffer;
          messageFormsByUserId[service_request.user_id] = new UntypedFormGroup({
            sendText: new UntypedFormControl(false, []),
            body: new UntypedFormControl('', [
              Validators.required,
              Validators.minLength(1),
              Validators.maxLength(this.MSG_MAX_LENGTH)
            ])
          });
        }

        this.messageFormsByUserId = messageFormsByUserId;

        console.log(response, this);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  sendMessageToUser(user: IUser) {
    const formGroup = this.messageFormsByUserId[user.id];
    console.log({ formGroup, user });
    this.carmasterService.send_user_message(this.you!.id, user.id, {
      ...formGroup.value,
      user
    }).subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        formGroup.get('body')?.setValue('');
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  sendOffer(service_request: IMechanicServiceRequest) {
    this.loading = true;
    this.carmasterService.send_service_request_offer(this.mechanic_profile!.id, service_request.id)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        if (response.data) {
          service_request.service_request_offers!.push(response.data);
          this.offerByServiceRequestId[service_request.id] = response.data;
        }
      }
    });
  }

  cancelOffer(service_request: IMechanicServiceRequest) {
    this.loading = true;
    this.carmasterService.cancel_service_request_offer(this.mechanic_profile!.id, service_request.id)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        if (response.data) {
          const yourOffer = service_request.service_request_offers!.find(offer => offer.mechanic!.user_id === this.you!.id && offer.status === COMMON_STATUSES.PENDING);
          yourOffer && (yourOffer.status = COMMON_STATUSES.CANCELED);
          this.offerByServiceRequestId[service_request.id] = undefined;
        }
      }
    });
  }
}
