import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PhonePipe } from './pipes/phone.pipe';
import { StripeAmountFormatterPipe } from './pipes/stripe-amount-formatter.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { UserFullNamePipe } from './pipes/user-full-name.pipe';
import { AlertService } from './services/alert.service';
import { ClientService } from './services/client.service';
import { EnvironmentService } from './services/environment.service';
import { GoogleMapsService } from './services/google-maps.service';
import { SocketEventsService } from './services/socket-events.service';
import { StripeService } from './services/stripe.service';
import { UsersService } from './services/users.service';
import { UtilityService } from './services/utility.service';
import { UserStoreService } from './stores/user-store.service';
import { APP_INIT_PROVIDER } from './_misc/app-init';



@NgModule({
  declarations: [
    PhonePipe,
    StripeAmountFormatterPipe,
    TimeAgoPipe,
    UserFullNamePipe,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
  ],
  exports: [
    PhonePipe,
    StripeAmountFormatterPipe,
    TimeAgoPipe,
    UserFullNamePipe,
  ],
  providers: [
    APP_INIT_PROVIDER,

    HttpClientModule,

    PhonePipe,
    StripeAmountFormatterPipe,
    TimeAgoPipe,
    UserFullNamePipe,

    AlertService,
    ClientService,
    EnvironmentService,
    GoogleMapsService,
    SocketEventsService,
    StripeService,
    UsersService,
    UserStoreService,
    UtilityService,
  ],
})
export class ModernCommonModule { }
