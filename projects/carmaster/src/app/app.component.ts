import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { EnvironmentService } from 'projects/common/src/app/services/environment.service';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'carmaster-root',
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
  ) { }

  count = 0;

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

        // if (you) {
        //   this.router.navigate(['/']);
        // }
        if (jwt) {
          console.log(jwt);
          this.userService.use_jwt_from_url(jwt).subscribe({
            next: (you) => {
              console.log(`loaded user from jwt`, { you });
              this.router.navigate(['/']);
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
  title = 'carmaster';
}
