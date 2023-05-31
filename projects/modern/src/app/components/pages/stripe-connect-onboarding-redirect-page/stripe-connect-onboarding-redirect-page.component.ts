import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'modern-stripe-connect-onboarding-redirect-page',
  templateUrl: './stripe-connect-onboarding-redirect-page.component.html',
  styleUrls: ['./stripe-connect-onboarding-redirect-page.component.scss']
})
export class StripeConnectOnboardingRedirectPageComponent implements OnInit {

  isRedirecting = false;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe({
      next: (params: Params) => {
        if (params['appDeepLinkRedirect']) {
          this.isRedirecting = true;
          setTimeout(() => {
            window.open(params['appDeepLinkRedirect']);
          }, 3000);
        }
      }
    });
  }

}
