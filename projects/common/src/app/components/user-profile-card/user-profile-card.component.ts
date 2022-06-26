import { Component, Input, OnInit } from '@angular/core';
import { IUser } from '../../interfaces/user.interface';
import { IUserSubscriptionInfo } from '../../interfaces/_common.interface';
import { UsersService } from '../../services/users.service';
import { UserStoreService } from '../../stores/user-store.service';

@Component({
  selector: 'common-user-profile-card',
  templateUrl: './user-profile-card.component.html',
  styleUrls: ['./user-profile-card.component.scss']
})
export class UserProfileCardComponent implements OnInit {
  you: IUser | null = null;
  @Input() user?: IUser | null;
  @Input() user_subscription_info: IUserSubscriptionInfo | null = null;
  
  
  @Input() app: string = 'modern';

  get isYou(): boolean {
    const match = (
      !!this.you && 
      !!this.user &&
      this.user.id === this.you.id
    );
    return match;
  };

  get isNotYou(): boolean {
    const match = (
      !!this.you && 
      !!this.user &&
      this.user.id !== this.you.id
    );
    return match;
  };

  constructor(
    private userStore: UserStoreService,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe({
      next: (you: IUser | null) => {
        this.you = you;
      }
    });

    if (this.user && !this.user_subscription_info) {
      // fetch subscription info if not given
      this.usersService.get_platform_subscription_info(this.user.id).subscribe({
        next: (response) => {
          this.user_subscription_info = response.data!;
        }
      });
    }
  }

}
