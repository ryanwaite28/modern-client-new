import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { ClientService } from 'projects/common/src/app/services/client.service';
import { GoogleMapsService } from 'projects/common/src/app/services/google-maps.service';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';

@Component({
  selector: 'common-verify-stripe-account-fragment',
  templateUrl: './verify-stripe-account-fragment.component.html',
  styleUrls: ['./verify-stripe-account-fragment.component.scss']
})
export class UserVerifyStripeAccountFragmentComponent implements OnInit {
  you: any;
  results: any;
  continue_onboarding: boolean = false;
  onboarding_url: string = '';

  constructor(
    private userStore: UserStoreService,
    private userService: UsersService,
    private alertService: AlertService,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    private googleService: GoogleMapsService,
  ) { }

  ngOnInit() {
    this.userStore.getChangesObs().subscribe({
      next: (you: IUser | null) => {
        this.you = you;
        this.checkStripeAccount();
      }
    });
  }

  checkStripeAccount() {
    this.userService.verify_stripe_account(this.you.id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.results = response;
        if (response.token) {
          window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
          this.userStore.setState(response.data.you);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.results = error.error;
        if (error.status === HttpStatusCode.PreconditionFailed) {
          this.continue_onboarding = true;
          this.onboarding_url = error.error.data.onboarding_url;
        }
      },
      complete: () => {
        
      },
    });
  }
}
