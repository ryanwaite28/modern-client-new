import { StripeAmountFormatterPipe } from './stripe-amount-formatter.pipe';

describe('StripeAmountFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new StripeAmountFormatterPipe();
    expect(pipe).toBeTruthy();
  });
});
