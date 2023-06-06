import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { StripeService } from 'projects/common/src/app/services/stripe.service';
import { loadStripe, Stripe } from '@stripe/stripe-js';


@Component({
  selector: 'modern-stripe-identity-verification-upload-page',
  templateUrl: './stripe-identity-verification-upload-page.component.html',
  styleUrls: ['./stripe-identity-verification-upload-page.component.scss']
})
export class StripeIdentityVerificationUploadPageComponent implements OnInit {

  loading: boolean = false;
  showUploadModal: boolean = false;
  isValidSession: boolean = false;
  stripe_pk: string = '';
  verification_session_client_secret: string = '';
  stripe?: Stripe;
  resultsString = '';
  return_url: string = '';
  verified = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private stripeService: StripeService
  ) { }

  ngOnInit(): void {
    this.stripeService.isReady.subscribe({
      next: () => {
        const stripe = this.stripeService.getStripe();
        this.stripe = stripe;
      }
    });

    this.activatedRoute.queryParams.subscribe({
      next: (params: Params) => {
        if (params['stripe_pk']) {
          this.stripe_pk = params['stripe_pk'];
        }
        if (params['verification_session_client_secret']) {
          this.verification_session_client_secret = params['verification_session_client_secret'];
        }
        if (params['return_url']) {
          this.return_url = params['return_url'];
        }
      }
    });
  }
  
  async handleVerification() {
    // https://stripe.com/docs/identity/verify-identity-documents
    // Get the VerificationSession client secret using the server-side
    // endpoint you created in step 3.

    const stripe = await loadStripe(this.stripe_pk);

    if (!stripe) {
      console.log(`Stripe not set up...`);
      return;
    }
    if (!this.verification_session_client_secret) {
      console.log(`No verification session client secret...`);
    }

    return stripe.verifyIdentity(this.verification_session_client_secret)
    .then((result) => {
      // If `verifyIdentity` fails, you should display the localized
      // error message to your user using `error.message`.
      console.log({ result });

      if (result.error) {
        window.alert(result.error.message);
      }
      else {
        // this.resultsString = JSON.stringify({ result });
        if (this.return_url) {
          // setTimeout();
          this.verified = true;
        }
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      window.alert(`Could not initiate verification process; something went wrong. Please try again later. If problem persists, please reach out via information found on the Contact page.`);
    });
  }
}
