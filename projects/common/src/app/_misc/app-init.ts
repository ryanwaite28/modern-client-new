import { APP_INITIALIZER } from "@angular/core";
import { catchError, mergeMap, of, take } from "rxjs";
import { ClientService } from "../services/client.service";
import { GoogleMapsService } from "../services/google-maps.service";
import { StripeService } from "../services/stripe.service";
import { UsersService } from "../services/users.service";




export function APP_INITIALIZER_FACTORY(
  clientService: ClientService,
  usersService: UsersService,
  googleMapsService: GoogleMapsService,
  stripeService: StripeService,
) {
  function APP_INITIALIZER_FN(
    resolve: (value: unknown) => void,
    reject: (reasom?: any) => any
  ) {
    clientService.getXsrfToken()
      .pipe(
        mergeMap((token, index) => {
          // console.log('APP_INITIALIZER (xsrf token) - admit one', clientService);
          return usersService.checkUserSession().pipe(take(1));
        }),
        mergeMap((user, index) => {
          // console.log('APP_INITIALIZER (user) - admit one', { user });
          return googleMapsService.loadGoogleMaps();
        }),
        mergeMap((user, index) => {
          // console.log('APP_INITIALIZER (user) - admit one', { user });
          return stripeService.loadStripe();
        }),
        mergeMap((stripe_loaded, index) => {
          // console.log('APP_INITIALIZER (google maps) - admit one', googleMapsService);
          resolve(stripe_loaded);
          return of(undefined);
        }),
        mergeMap((value, index) => {
          console.log(`\n\nDone App Initializations\n\n\n`);
          return of();
        }),
        catchError((error: any) => {
          console.log(error);
          resolve(false);
          throw error;
        })
      )
      .toPromise();
  }

  function returnFactoryFn() {
    return new Promise(APP_INITIALIZER_FN);
  }

  return returnFactoryFn;
}

export const APP_INIT_PROVIDER = {
  provide: APP_INITIALIZER,
  multi: true,
  deps: [
    ClientService,
    UsersService,
    GoogleMapsService,
    StripeService,
  ],
  useFactory: APP_INITIALIZER_FACTORY
};
