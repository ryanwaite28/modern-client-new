import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CARMASTER_EVENT_TYPES } from 'projects/carmaster/src/app/enums/car-master.enum';
import { IMechanic, IMechanicServiceRequest, IMechanicServiceRequestOffer } from 'projects/carmaster/src/app/interfaces/carmaster.interface';
import { CarmasterService } from 'projects/carmaster/src/app/services/carmaster.service';
import { service_categories_display_by_key } from 'projects/carmaster/src/app/utils/car-services.chamber';
import { COMMON_STATUSES, MODERN_APPS } from 'projects/common/src/app/enums/all.enums';
import { PlainObject } from 'projects/common/src/app/interfaces/json-object.interface';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { IUserSubscriptionInfo } from 'projects/common/src/app/interfaces/_common.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { EnvironmentService } from 'projects/common/src/app/services/environment.service';
import { GoogleMapsService } from 'projects/common/src/app/services/google-maps.service';
import { SocketEventsService } from 'projects/common/src/app/services/socket-events.service';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { combineLatest, finalize, map, mergeMap, Subscription } from 'rxjs';

@Component({
  selector: 'carmaster-mechanic-service-request-offers-page',
  templateUrl: './mechanic-service-request-offers-page.component.html',
  styleUrls: ['./mechanic-service-request-offers-page.component.scss']
})
export class MechanicServiceRequestOffersPageComponent implements OnInit {
  you: IUser | null = null;
  user: IUser | null = null;
  user_subscription_info: IUserSubscriptionInfo | null = null;

  mechanic_profile: IMechanic | null = null;
  service_request_offers: IMechanicServiceRequestOffer[] = [];
  end_reached = false;
  loading = false;

  MSG_MAX_LENGTH = 1000;
  messageFormsByUserId: PlainObject<UntypedFormGroup> = {};
  service_categories_display_by_key = service_categories_display_by_key;
  subsList: Subscription[] = [];
  
  get isYou(): boolean {
    const isYours = (
      this.you && 
      this.user &&
      this.user.id === this.you.id
    );
    return !!isYours;
  };

  get isUserActiveMember(): boolean {
    const match = !!this.user_subscription_info && this.user_subscription_info.active;
    return match;
  }

  constructor(
    private userStore: UserStoreService,
    private userService: UsersService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private googleService: GoogleMapsService,
    private envService: EnvironmentService,
    private carmasterService: CarmasterService,
    private socketEventsService: SocketEventsService,
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.userStore.getChangesObs(),
      this.route.parent!.data
    ])
    .pipe(
      map((values) => {
        const [you, data] = values;
        
        this.you = you;
        
        this.user = data['user'];
        this.user_subscription_info = data['user_subscription_info'];
        this.mechanic_profile = data['mechanic_profile'];
        
        console.log(values, this);
      })
    )
    .subscribe({
      next: (values) => {
        this.init();
      }
    });
  }

  ngOnDestroy() {
    this.subsList.forEach(sub => sub.unsubscribe());
  }
  
  init() {
    this.subsList = [
      this.socketEventsService.listenToObservableEventStream(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.SERVICE_REQUEST_OFFER_DECLINED).subscribe({
        next: (event) => {
          const index = event.service_request_offer_id ? this.service_request_offers.findIndex(offer => offer.id === event.service_request_offer_id) : -1;
          (index > -1) && this.service_request_offers.splice(index, 1);
        }
      }),
      this.socketEventsService.listenToObservableEventStream(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.SERVICE_REQUEST_OFFER_ACCEPTED).subscribe({
        next: (event) => {
          const index = event.service_request_offer_id ? this.service_request_offers.findIndex(offer => offer.id === event.service_request_offer_id) : -1;
          (index > -1) && this.service_request_offers.splice(index, 1);
        }
      }),
    ];
    this.getServiceRequestOffers();
  }
  
  getServiceRequestOffers() {
    const min_id = this.service_request_offers.length
      ? this.service_request_offers[this.service_request_offers.length - 1].id
      : undefined;
    this.carmasterService.get_mechanic_service_request_offers(this.mechanic_profile!.id, min_id, false).subscribe({
      next: (response) => {
        this.service_request_offers = response.data!;
        const messageFormsByUserId: PlainObject<UntypedFormGroup> = {};
        for (const service_request_offer of this.service_request_offers) {
          messageFormsByUserId[service_request_offer.service_request_user_id] = new UntypedFormGroup({
            sendText: new UntypedFormControl(false, []),
            body: new UntypedFormControl('', [
              Validators.required,
              Validators.minLength(1),
              Validators.maxLength(this.MSG_MAX_LENGTH)
            ])
          });
        }

        this.messageFormsByUserId = messageFormsByUserId;
        this.end_reached = response.data!.length < 5;
        console.log(response, this);
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

  cancelOffer(service_request_offer: IMechanicServiceRequestOffer) {
    this.loading = true;
    this.carmasterService.cancel_service_request_offer(this.mechanic_profile!.id, service_request_offer.service_request_id)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        if (response.data) {
          const index = this.service_request_offers.indexOf(service_request_offer);
          (index > -1) && this.service_request_offers.splice(index, 1);
        }
      }
    });
  }
}