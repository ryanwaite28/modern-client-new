import { Pipe, PipeTransform } from '@angular/core';
import { StripeService } from '../services/stripe.service';
import { UsersService } from '../services/users.service';

@Pipe({
  name: 'payout'
})
export class PayoutPipe implements PipeTransform {
  /* 
    This pipe is for formatting how much the user gets from the payout, depending on if they have a membership or not
  */

  is_subscription_active = false;

  constructor(
    private usersService: UsersService,
    private stripeService: StripeService,
  ) {
    console.log(`PayoutPipe - subscribing to membership status`);
    this.usersService.getSubscriptionActiveStream().subscribe({
      next: (status) => {
        this.is_subscription_active = status;
      }
    });
  }

  transform(value: unknown, ...args: unknown[]): any {
    if (!value) {
      console.log(`unknown value:`, { value });
      return value;
    }

    const useValue = !isNaN(parseInt(value as any)) && parseInt(value as any) || 0;
    if (!useValue) {
      return value;
    }

    const chargeFeeData = this.stripeService.add_on_stripe_processing_fee(useValue, this.is_subscription_active);
    const userGets = this.is_subscription_active
      ? chargeFeeData.total
      : (chargeFeeData.total - chargeFeeData.app_fee);

    const userGetsFormatted = userGets / 100;
    return userGetsFormatted;
  }

}
