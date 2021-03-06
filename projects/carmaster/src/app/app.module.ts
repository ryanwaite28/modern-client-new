import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ModernCommonModule } from 'projects/common/src/app/app.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/fragments/footer/footer.component';
import { NavbarComponent } from './components/fragments/navbar/navbar.component';
import { WelcomeComponent } from './components/pages/welcome/welcome.component';
import { UserPageComponent } from './components/pages/user-page/user-page.component';
import { SettingsPageComponent } from './components/pages/user-page/settings-page/settings-page.component';
import { HomePageComponent } from './components/pages/user-page/home-page/home-page.component';
import { MechanicProfilePageComponent } from './components/pages/user-page/mechanic-profile-page/mechanic-profile-page.component';
import { MechanicCredentialFormComponent } from './components/fragments/forms/mechanic-credential-form/mechanic-credential-form.component';
import { MechanicExpertiseFormComponent } from './components/fragments/forms/mechanic-expertise-form/mechanic-expertise-form.component';
import { MechanicServiceFormComponent } from './components/fragments/forms/mechanic-service-form/mechanic-service-form.component';
import { MechanicServiceRequestFormComponent } from './components/fragments/forms/mechanic-service-request-form/mechanic-service-request-form.component';
import { MechanicRatingFormComponent } from './components/fragments/forms/mechanic-rating-form/mechanic-rating-form.component';
import { MechanicFieldFormComponent } from './components/fragments/forms/mechanic-field-form/mechanic-field-form.component';
import { MechanicCredentialReportingFormComponent } from './components/fragments/forms/mechanic-credential-reporting-form/mechanic-credential-reporting-form.component';
import { MechanicCredentialReportingMessageFormComponent } from './components/fragments/forms/mechanic-credential-reporting-message-form/mechanic-credential-reporting-message-form.component';
import { MechanicFieldComponent } from './components/fragments/mechanic-field/mechanic-field.component';
import { MechanicCredentialComponent } from './components/fragments/mechanic-credential/mechanic-credential.component';
import { MechanicExpertiseComponent } from './components/fragments/mechanic-expertise/mechanic-expertise.component';
import { MechanicServiceComponent } from './components/fragments/mechanic-service/mechanic-service.component';
import { MechanicRatingComponent } from './components/fragments/mechanic-rating/mechanic-rating.component';
import { MechanicSearchComponent } from './components/pages/search-page/mechanic-search/mechanic-search.component';
import { CreateServiceRequestComponent } from './components/pages/create-service-request/create-service-request.component';
import { MechanicSearchFormComponent } from './components/fragments/forms/mechanic-search-form/mechanic-search-form.component';
import { UserMessagesFragmentComponent } from './components/pages/user-page/messages-page/messages.component';
import { UserNotificationsFragmentComponent } from './components/pages/user-page/notifications-page/notifications.component';
import { DecimalPipe } from '@angular/common';
import { CREATE_APP_INIT_SOCKET_EVENTS_PROVIDER } from 'projects/common/src/app/_misc/app-init';
import { CARMASTER_EVENT_TYPES } from './enums/car-master.enum';
import { MODERN_APPS } from 'projects/common/src/app/enums/all.enums';
import { SearchPageComponent } from './components/pages/search-page/search-page.component';
import { ServiceRequestSearchComponent } from './components/pages/search-page/service-request-search/service-request-search.component';
import { ServiceRequestSearchFormComponent } from './components/fragments/forms/service-request-search-form/service-request-search-form.component';
import { ServiceRequestFormComponent } from './components/fragments/forms/service-request-form/service-request-form.component';
import { UserServiceRequestsComponent } from './components/pages/user-page/user-service-requests/user-service-requests.component';
import { MechanicServiceRequestsComponent } from './components/pages/user-page/mechanic-service-requests/mechanic-service-requests.component';
import { ServiceRequestCardComponent } from './components/fragments/service-request-card/service-request-card.component';
import { MechanicPageComponent } from './components/pages/user-page/mechanic-page/mechanic-page.component';
import { MechanicServiceRequestOffersPageComponent } from './components/pages/user-page/mechanic-service-request-offers-page/mechanic-service-request-offers-page.component';
import { NotificationsPageComponent } from './components/pages/user-page/notifications-page/notifications-page.component';

@NgModule({
  declarations: [
    AppComponent,

    NavbarComponent,
    FooterComponent,
    WelcomeComponent,
    UserPageComponent,
    SettingsPageComponent,
    HomePageComponent,
    MechanicProfilePageComponent,
    MechanicCredentialFormComponent,
    MechanicExpertiseFormComponent,
    MechanicServiceFormComponent,
    MechanicServiceRequestFormComponent,
    MechanicRatingFormComponent,
    MechanicFieldFormComponent,
    MechanicCredentialReportingFormComponent,
    MechanicCredentialReportingMessageFormComponent,
    MechanicFieldComponent,
    MechanicCredentialComponent,
    MechanicExpertiseComponent,
    MechanicServiceComponent,
    MechanicRatingComponent,
    MechanicSearchComponent,
    ServiceRequestSearchFormComponent,
    CreateServiceRequestComponent,
    MechanicSearchFormComponent,
    UserMessagesFragmentComponent,
    UserNotificationsFragmentComponent,
    SearchPageComponent,
    ServiceRequestSearchComponent,
    ServiceRequestFormComponent,
    UserServiceRequestsComponent,
    MechanicServiceRequestsComponent,
    ServiceRequestCardComponent,
    MechanicPageComponent,
    MechanicServiceRequestOffersPageComponent,
    NotificationsPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ModernCommonModule,
  ],
  providers: [
    CREATE_APP_INIT_SOCKET_EVENTS_PROVIDER(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES),
    DecimalPipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
