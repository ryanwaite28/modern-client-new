import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IMechanic } from 'projects/carmaster/src/app/interfaces/carmaster.interface';
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
  selector: 'carmaster-mechanic-service-requests',
  templateUrl: './mechanic-service-requests.component.html',
  styleUrls: ['./mechanic-service-requests.component.scss']
})
export class MechanicServiceRequestsComponent implements OnInit {
  you: IUser | null = null;
  user: IUser | null = null;
  user_subscription_info: IUserSubscriptionInfo | null = null;

  mechanic_profile: IMechanic | null = null;
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
        this.mechanic_profile = data['mechanic_profile'];
      }
    });

  }

}
