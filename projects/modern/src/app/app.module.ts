import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ModernCommonModule } from 'projects/common/src/app/app.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/fragments/navbar/navbar.component';
import { FooterComponent } from './components/fragments/footer/footer.component';
import { WelcomeComponent } from './components/pages/welcome/welcome.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { SigninComponent } from './components/pages/signin/signin.component';
import { UserComponent } from './components/pages/user/user.component';
import { HomeComponent } from './components/pages/user/home/home.component';
import { SettingsComponent } from './components/pages/user/settings/settings.component';
import { AboutComponent } from './components/pages/about/about.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { TermsAgreementsComponent } from './components/pages/terms-agreements/terms-agreements.component';
import { PrivacyPolicyComponent } from './components/pages/privacy-policy/privacy-policy.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    WelcomeComponent,
    SignupComponent,
    SigninComponent,
    UserComponent,
    HomeComponent,
    SettingsComponent,
    AboutComponent,
    ContactComponent,
    TermsAgreementsComponent,
    PrivacyPolicyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ModernCommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
