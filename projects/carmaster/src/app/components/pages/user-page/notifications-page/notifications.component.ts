import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CARMASTER_EVENT_TYPES } from 'projects/carmaster/src/app/enums/car-master.enum';
import { CarmasterService } from 'projects/carmaster/src/app/services/carmaster.service';
import { MODERN_APPS } from 'projects/common/src/app/enums/all.enums';
import { INotification } from 'projects/common/src/app/interfaces/notification.interface';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { AppSocketEventsStateService } from 'projects/common/src/app/services/app-socket-events-state.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'common-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class UserNotificationsFragmentComponent implements OnInit {
  you: IUser | any;
  
  notifications: INotification[] = [];
  loading: boolean = false;
  end_reached = true;
  shouldUpdateLastOpened = true;
  
  constructor(
    private userStore: UserStoreService,
    private carmasterService: CarmasterService,
    private router: Router,
    private route: ActivatedRoute,
    private appSocketEventsStateService: AppSocketEventsStateService,
  ) { }

  ngOnInit() {
    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;

      if (this.shouldUpdateLastOpened) {
        this.shouldUpdateLastOpened = false;
        this.getNotifications();
        const notificationSub = this.carmasterService.update_user_last_opened_notifications(this.you!.id)
          .pipe(take(1))
          .subscribe({
            next: (response: any) => {
              notificationSub.unsubscribe();
              // this.appSocketEventsStateService.clear(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES);
            }
          });
      }
    });
  }

  getNotifications() {
    const min_id =
      this.notifications.length &&
      this.notifications[this.notifications.length - 1].id;
    this.loading = true;
    this.carmasterService.getUserNotifications(
      this.you!.id,
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
