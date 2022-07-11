import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IMechanicServiceRequest } from 'projects/carmaster/src/app/interfaces/carmaster.interface';
import { CarmasterService } from 'projects/carmaster/src/app/services/carmaster.service';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { IUserSubscriptionInfo } from 'projects/common/src/app/interfaces/_common.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { EnvironmentService } from 'projects/common/src/app/services/environment.service';
import { GoogleMapsService } from 'projects/common/src/app/services/google-maps.service';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { combineLatest } from 'rxjs';

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
          this.getServiceRequests();
        }
      }
    });
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

  onDeleteServiceRequest(delivery: any) {
    // this.loading = true;
    // this.deliveryService.delete_delivery(delivery.id).subscribe({
    //   next: (response: any) => {
    //     this.alertService.handleResponseSuccessGeneric(response);
    //     const index = this.deliveries.indexOf(delivery);
    //     this.deliveries.splice(index, 1);
    //     this.loading = false;
    //     this.changeDetectorRef.detectChanges();
    //   },
    //   error: (error: HttpErrorResponse) => {
    //     this.loading = false;
    //     this.changeDetectorRef.detectChanges();
    //   },
    // });
  }
}
