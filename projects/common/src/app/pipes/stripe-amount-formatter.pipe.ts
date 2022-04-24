import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripeAmountFormatter'
})
export class StripeAmountFormatterPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    const valueStrSplit = value.toString().split('');
    valueStrSplit.splice(valueStrSplit.length - 2, 0, '.');
    const newValue = parseFloat(valueStrSplit.join(''));
    return newValue;
  }

}
