import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ModernCommonModule } from 'projects/common/src/app/app.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/fragments/footer/footer.component';
import { NavbarComponent } from './components/fragments/navbar/navbar.component';
import { WelcomeComponent } from './components/pages/welcome/welcome.component';

import { DeliverMeDeliveryBrowseMapPageComponent } from './components/pages/delivery-browse-map/delivery-browse-map.component';
import { DeliverMeDeliveryBrowseRecentPageComponent } from './components/pages/delivery-browse-recent/delivery-browse-recent.component';
import { DeliverMeDeliveryContainerPageComponent } from './components/pages/delivery-container-page/delivery-container-page.component';
import { DeliverMeDeliveryPageComponent } from './components/pages/delivery-container-page/delivery-page/delivery-page.component';
import { DeliveryPaymentCancelPageComponent } from './components/pages/delivery-container-page/delivery-payment-cancel-page/delivery-payment-cancel-page.component';
import { DeliveryPaymentSuccessPageComponent } from './components/pages/delivery-container-page/delivery-payment-success-page/delivery-payment-success-page.component';
import { DeliverMeUserCreateDeliveryFragmentComponent } from './components/pages/user/create-delivery/create-delivery.component';
import { DeliverMeUserDeliveriesFragmentComponent } from './components/pages/user/deliveries/deliveries.component';
import { DeliverMeUserDeliveringFragmentComponent } from './components/pages/user/delivering/delivering.component';
import { DeliverMeUserDeliverySearchFragmentComponent } from './components/pages/user/delivery-search/delivery-search.component';
import { DeliverMeUserHomeComponent } from './components/pages/user/home/home.component';
import { DeliverMeUserSettingsFragmentComponent } from './components/pages/user/settings/settings.component';
import { DeliverMeUserPageComponent } from './components/pages/user/user-page.component';
import { DeliveryCardComponent } from './components/fragments/delivery-card/delivery-card.component';
import { DeliveryFormComponent } from './components/fragments/delivery-form/delivery-form.component';
import { DeliverMeDeliveryBrowseFeaturedPageComponent } from './components/pages/delivery-browse-featured/delivery-browse-featured.component';
import { CREATE_APP_INIT_SOCKET_EVENTS_PROVIDER } from 'projects/common/src/app/_misc/app-init';
import { DELIVERME_EVENT_TYPES } from './enums/deliverme.enum';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    WelcomeComponent,

    DeliverMeUserPageComponent,
    DeliverMeUserHomeComponent,
    DeliverMeUserSettingsFragmentComponent,
    DeliverMeUserDeliveriesFragmentComponent,
    DeliverMeUserDeliveringFragmentComponent,
    DeliveryFormComponent,
    DeliveryCardComponent,
    DeliverMeUserCreateDeliveryFragmentComponent,
    DeliverMeUserDeliverySearchFragmentComponent,
    DeliverMeDeliveryContainerPageComponent,
    DeliverMeDeliveryPageComponent,
    DeliveryPaymentSuccessPageComponent,
    DeliveryPaymentCancelPageComponent,
    DeliverMeDeliveryBrowseRecentPageComponent,
    DeliverMeDeliveryBrowseMapPageComponent,
    DeliverMeDeliveryBrowseFeaturedPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ModernCommonModule,
  ],
  providers: [
    CREATE_APP_INIT_SOCKET_EVENTS_PROVIDER(DELIVERME_EVENT_TYPES),
    DecimalPipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
