import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CARMASTER_EVENT_TYPES } from 'projects/carmaster/src/app/enums/car-master.enum';
import { IMechanicServiceRequest } from 'projects/carmaster/src/app/interfaces/carmaster.interface';
import { CarmasterService } from 'projects/carmaster/src/app/services/carmaster.service';
import { MODERN_APPS } from 'projects/common/src/app/enums/all.enums';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { IUserSubscriptionInfo } from 'projects/common/src/app/interfaces/_common.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { EnvironmentService } from 'projects/common/src/app/services/environment.service';
import { GoogleMapsService } from 'projects/common/src/app/services/google-maps.service';
import { SocketEventsService } from 'projects/common/src/app/services/socket-events.service';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { combineLatest, finalize, Subscription } from 'rxjs';

@Component({
  selector: 'carmaster-user-service-requests',
  templateUrl: './user-service-requests.component.html',
  styleUrls: ['./user-service-requests.component.scss']
})
export class UserServiceRequestsComponent implements OnInit {
  you: IUser | null = null;
  user: IUser | null = null;
  user_subscription_info: IUserSubscriptionInfo | null = null;
  loading = false;
  service_requests: IMechanicServiceRequest[] = [];
  end_reached: boolean = false;
  initialized: boolean = false;
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
    ]).subscribe({
      next: (values) => {
        console.log(values);

        const [you, data] = values;
        
        this.you = you;

        this.user = data['user'];
        this.user_subscription_info = data['user_subscription_info'];
        if (!this.initialized) {
          this.initialized = true;
          this.init();
        }
      }
    });
  }

  ngOnDestroy() {
    this.subsList.forEach(sub => sub.unsubscribe());
  }
  
  init() {
    this.subsList = [
      this.socketEventsService.listenToObservableEventStream(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.SERVICE_REQUEST_MECHANIC_CANCELED).subscribe({
        next: (event) => {
          const index = event.service_request_id ? this.service_requests.findIndex(service_request => service_request.id === event.service_request_id) : -1;
          (index > -1) && this.service_requests.splice(index, 1);
        }
      }),
    ];
    this.getServiceRequests();
  }

  getServiceRequests() {
    const min_id =
      this.service_requests.length &&
      this.service_requests[this.service_requests.length - 1].id;

    this.loading = true;
    this.carmasterService.get_user_service_requests(this.you!.id, min_id, false).subscribe({
      next: (response: any) => {
        this.service_requests.push(...response.data);

        this.end_reached = response.data.length < 5;
        this.loading = false;
        console.log(this, { response });
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
      },
    });
  }

  onDeleteServiceRequest(service_request: IMechanicServiceRequest) {
    const ask = window.confirm(
      `Are you sure you want to delete this service request? This action cannot be undone.`
    );
    if (!ask) {
      return;
    }
    
    this.loading = true;
    this.carmasterService.delete_service_request(this.you!.id, service_request.id)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response: any) => {
        this.alertService.handleResponseSuccessGeneric(response);
        const index = this.service_requests.indexOf(service_request);
        this.service_requests.splice(index, 1);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
    });
  }
}
