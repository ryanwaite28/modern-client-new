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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ModernCommonModule,
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
