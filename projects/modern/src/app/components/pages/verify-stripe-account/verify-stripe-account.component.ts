import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';

@Component({
  selector: 'modern-verify-stripe-account',
  templateUrl: './verify-stripe-account.component.html',
  styleUrls: ['./verify-stripe-account.component.scss']
})
export class VerifyStripeAccountComponent implements OnInit {

  message: string = '';
  you: any;
  results: any;
  continue_onboarding: boolean = false;
  onboarding_url: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private userStore: UserStoreService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.usersService.verify_stripe_account_via_uuid(params['user_uuid']).subscribe({
        next: (response: any) => {
          console.log(response);
          this.results = response;
          const token = response.token || response.data.token;
          if (token) {
            window.localStorage.setItem('rmw-modern-apps-jwt', token);
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
    });
  }

}
