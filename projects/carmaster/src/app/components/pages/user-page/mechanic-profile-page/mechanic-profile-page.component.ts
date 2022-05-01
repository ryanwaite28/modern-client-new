import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { IUserSubscriptionInfo } from 'projects/common/src/app/interfaces/_common.interface';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';



@Component({
  selector: 'carmaster-mechanic-profile-page',
  templateUrl: './mechanic-profile-page.component.html',
  styleUrls: ['./mechanic-profile-page.component.scss']
})
export class MechanicProfilePageComponent implements OnInit {
  you: IUser | null = null;
  user: IUser | null = null;
  user_subscription_info: IUserSubscriptionInfo | null = null;

  get isYou(): boolean {
    const isYours = (
      this.you && 
      this.user &&
      this.user.id === this.you.id
    );
    return !!isYours;
  };

  constructor(
    private userStore: UserStoreService,
    private userService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe((you: IUser | null) => {
      this.you = you;
    });

    this.route.parent!.data.subscribe((data) => {
      this.user = data['user'];
      this.user_subscription_info = data['user_subscription_info'];
    });
  }

}
