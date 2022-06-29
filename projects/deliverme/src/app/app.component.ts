import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MODERN_APPS } from 'projects/common/src/app/enums/all.enums';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { EnvironmentService } from 'projects/common/src/app/services/environment.service';
import { UnseenService } from 'projects/common/src/app/services/unseen.service';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { combineLatest, filter, skip } from 'rxjs';
import { DELIVERME_EVENT_TYPES } from './enums/deliverme.enum';

@Component({
  selector: 'deliverme-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private userService: UsersService,
    private userStore: UserStoreService,
    private alertService: AlertService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private envService: EnvironmentService,
    private unseenService: UnseenService,
  ) { }

  count = 0;
  isListening = false;

  ngOnInit() {
    combineLatest([
      this.userStore.getChangesObs(),
      this.activatedRoute.queryParams
    ])
    .subscribe({
      next: (values) => {
        const you = values[0];
        const params = values[1];
        const jwt = params['jwt'];

        // console.log(you);
        // console.log(jwt);

        if (you) {
          // this.router.navigate(['/']);
          if (!this.isListening) {
            this.isListening = true;
            this.unseenService.registerEvents(MODERN_APPS.DELIVERME, Object.keys(DELIVERME_EVENT_TYPES));
          }
        }
        if (jwt) {
          this.userService.use_jwt_from_url(jwt).subscribe({
            next: (you) => {
              console.log(`loaded user from jwt`, { you });
              this.router.navigate(['/']);
              if (!this.isListening) {
                this.isListening = true;
                this.unseenService.registerEvents(MODERN_APPS.CARMASTER, Object.keys(DELIVERME_EVENT_TYPES));
              }
            }
          });
        }
        // if (jwt && !you) {
        // }
        // else if (!jwt && !you) {
        //   const redirect = `${this.envService.MODERN_DOMAIN}/signin?redirect=${window.location.href}`;
        //   window.location.href = redirect;
        // }
      }
    });
  }
  title = 'deliverme';
}
