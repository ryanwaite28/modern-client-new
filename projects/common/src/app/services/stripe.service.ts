import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { from, mergeMap, of } from 'rxjs';
import { StripeAmountFormatterPipe } from '../pipes/stripe-amount-formatter.pipe';
import { ClientService } from './client.service';
import { UsersService } from './users.service';



@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripe_public_key: any;
  private stripe: Stripe | null = null;
  private is_subscription_active: boolean = false;

  constructor(
    private clientService: ClientService,
    private usersService: UsersService,
    private stripeAmountFormatterPipe: StripeAmountFormatterPipe
  ) {
    this.usersService.getSubscriptionActiveStream().subscribe({
      next: (is_subscription_active: boolean) => {
        this.is_subscription_active = is_subscription_active;
      }
    });
  }

  loadStripe() {
    return this.clientService.sendRequest<{ data: string }>(`/common/utils/get-stripe-public-key`, 'POST')
      .pipe(
        mergeMap((response: any, index: number) => {
          this.stripe_public_key = response.data.key;
          console.log(`Stripe PK loaded, attempting initialization...`);
          return from(loadStripe(this.stripe_public_key));
        }),
        mergeMap((stripe: Stripe | null) => {
          this.stripe = stripe;

          if (stripe) {
            console.log(`Stripe initialized successfully`, this);
            return of(true);
          }
          else {
            console.log(`Stripe could not initialized`, this);
            return of(false);
          }
        })
      )
  }

  getStripe() {
    return this.stripe!;
  }

  get_stripe_public_key() {
    return !!this.stripe_public_key
      ? this.stripe_public_key as string
      : undefined;
  }

  add_on_stripe_processing_fee(amount: number, isAmountAdjusted: boolean = false) {
    const stripePercentageFeeRate = 0.029;
    const stripeFixedFeeRate = 30; // 30 cents

    const total = isAmountAdjusted ? amount : parseInt(amount.toString() + '00');
    const stripe_processing_fee = Math.round(total * stripePercentageFeeRate) + stripeFixedFeeRate;
    let new_total = Math.round(total + stripe_processing_fee);
    const difference = new_total - total;
    let app_fee = this.is_subscription_active ? 0 : (parseInt((total * 0.1).toString(), 10));
    // app_fee = Math.round(difference + app_fee);
    const final_total = Math.round(new_total + app_fee);
    // new_total = new_total + app_fee;
    const data = { amount, final_total, app_fee, stripe_processing_fee, new_total, isAmountAdjusted, total, difference };
    console.log(data);
    return data;
  }

  formatStripeAmount(amount: number) {
    return this.stripeAmountFormatterPipe.transform(amount);
  }
}