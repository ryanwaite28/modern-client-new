import { APP_INITIALIZER } from "@angular/core";
import { catchError, filter, firstValueFrom, map, mergeMap, of, take } from "rxjs";
import { COMMON_EVENT_TYPES, MODERN_APPS } from "../enums/all.enums";
import { PlainObject } from "../interfaces/json-object.interface";
import { ClientService } from "../services/client.service";
import { GoogleMapsService } from "../services/google-maps.service";
import { SocketEventsService } from "../services/socket-events.service";
import { StripeService } from "../services/stripe.service";
import { UsersService } from "../services/users.service";




export function APP_SOCKET_EVENTS_INITIALIZER_FACTORY_CURRY(
  app: MODERN_APPS,
  event_types_map: PlainObject
) {
  return function APP_SOCKET_EVENTS_INITIALIZER_FACTORY(
   socketEventsService: SocketEventsService
  ) {
    async function APP_SOCKET_EVENTS_INITIALIZER_FN(
      resolve: (value: unknown) => void,
      reject: (reasom?: any) => any
    ) {

      const isServiceReadyObs = socketEventsService.getServiceIsReady()
        .pipe(filter((isReady) => { return isReady; }))
        .pipe(take(1));

      const isReady = await firstValueFrom(isServiceReadyObs);
      console.log(`APP_SOCKET_EVENTS_INITIALIZER_FN - isReady:`, isReady);
      socketEventsService.registerAppEventListenerStreams(app, event_types_map);
      return resolve(true);

      // socketEventsService.getRegistrationIsReady().pipe(take(1)).subscribe({
      //   next: () => {
      //   }
      // });
    }

    function returnFactoryFn() {
      return new Promise(APP_SOCKET_EVENTS_INITIALIZER_FN);
    }
  
    return returnFactoryFn;
  }
}

export function APP_INITIALIZER_FACTORY(
  clientService: ClientService,
  usersService: UsersService,
  googleMapsService: GoogleMapsService,
  stripeService: StripeService,
  socketEventsService: SocketEventsService,
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

          const isServiceReadyObs = socketEventsService.getServiceIsReady()
            .pipe(filter((isReady) => { return isReady; }))
            .pipe(take(1))
            .pipe(map((state) => {
              socketEventsService.registerAppEventListenerStreams(MODERN_APPS.COMMON, COMMON_EVENT_TYPES);
              return state;
            }))

          return firstValueFrom(isServiceReadyObs);
        }),
        mergeMap((app_loaded, index) => {
          // console.log('APP_INITIALIZER (google maps) - admit one', googleMapsService);
          resolve(app_loaded);
          return of(true);
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
    SocketEventsService,
  ],
  useFactory: APP_INITIALIZER_FACTORY
};

export const CREATE_APP_INIT_SOCKET_EVENTS_PROVIDER = (app: MODERN_APPS, event_types_map: PlainObject) => {
  const factory = APP_SOCKET_EVENTS_INITIALIZER_FACTORY_CURRY(app, event_types_map);

  return {
    provide: APP_INITIALIZER,
    multi: true,
    deps: [
      SocketEventsService
    ],
    useFactory: factory
  };
}
