import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MODERN_APPS } from 'projects/common/src/app/enums/all.enums';
import { INotification } from 'projects/common/src/app/interfaces/notification.interface';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { take } from 'rxjs';

@Component({
  selector: 'carmaster-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.scss']
})
export class NotificationsPageComponent implements OnInit {
  you: IUser | any;
  
  notifications: INotification[] = [];
  loading: boolean = false;
  end_reached = true;
  shouldUpdateLastOpened = true;
  
  constructor(
    private userStore: UserStoreService,
    private userService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.userStore.getChangesObs().subscribe({
      next: (you) => {
        this.you = you;

        if (this.shouldUpdateLastOpened) {
          this.shouldUpdateLastOpened = false;
          this.getNotifications();
          const notificationSub = this.userService.updateUserAppNotificationsLastOpened(this.you!.id, MODERN_APPS.CARMASTER)
            .pipe(take(1))
            .subscribe({
              next: (response: any) => {
                notificationSub.unsubscribe();
              }
            });
        }
      }
    });
  }

  getNotifications() {
    const min_id =
      this.notifications.length &&
      this.notifications[this.notifications.length - 1].id;
    this.loading = true;
    this.userService.getUserAppNotifications<any>(
      this.you!.id,
      MODERN_APPS.CARMASTER,
      min_id,
    ).subscribe({
      next: (response: any) => {
        for (const notification of response.data) {
          this.notifications.push(notification);
        }
        this.end_reached = response.data.length < 5;
        this.loading = false;
      }
    });
  }
}
