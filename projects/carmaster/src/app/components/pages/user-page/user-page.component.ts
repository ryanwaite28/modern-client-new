import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IUserField } from 'projects/common/src/app/interfaces/user-field.interface';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { IUserSubscriptionInfo } from 'projects/common/src/app/interfaces/_common.interface';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';

@Component({
  selector: 'carmaster-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
  you: IUser | any;
  user: IUser | any;
  user_fields: IUserField[] = [];
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

  ngOnInit() {
    this.userStore.getChangesObs().subscribe((you: IUser | null) => {
      this.you = you;
    });

    this.route.data.subscribe((data) => {
      console.log(data);
      this.user = data['user'];
      this.user_subscription_info = data['user_subscription_info'];
    });
  }
}
