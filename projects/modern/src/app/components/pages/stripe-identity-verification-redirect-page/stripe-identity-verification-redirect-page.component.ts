import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'modern-stripe-identity-verification-redirect-page',
  templateUrl: './stripe-identity-verification-redirect-page.component.html',
  styleUrls: ['./stripe-identity-verification-redirect-page.component.scss']
})
export class StripeIdentityVerificationRedirectPageComponent implements OnInit {

  isRedirecting = false;
  link = '';

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe({
      next: (params: Params) => {
        if (params['appDeepLinkRedirectURL']) {
          this.isRedirecting = true;
          this.link = params['appDeepLinkRedirectURL'];
          // window.open(params['appDeepLinkRedirectURL']);
          
          setTimeout(() => {
            location.href = params['appDeepLinkRedirectURL'];
          }, 1000);
        }
      }
    });
  }

}
