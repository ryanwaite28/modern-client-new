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
import { AboutComponent } from './components/pages/about/about.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { TermsAgreementsComponent } from './components/pages/terms-agreements/terms-agreements.component';
import { PrivacyPolicyComponent } from './components/pages/privacy-policy/privacy-policy.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignoutComponent } from './components/pages/signout/signout.component';

import { UserHomeFragmentComponent } from './components/pages/user/home/home.component';
import { UserSettingsFragmentComponent } from './components/pages/user/settings/settings.component';
import { UserPageComponent } from './components/pages/user/user-page.component';
import { UserNotificationsFragmentComponent } from './components/pages/user/notifications/notifications.component';
import { UserFieldsComponent } from './components/pages/user/user-fields/user-fields.component';
import { UserVerifyStripeAccountFragmentComponent } from './components/pages/user/verify-stripe-account-fragment/verify-stripe-account-fragment.component';
import { UserMessagesFragmentComponent } from './components/pages/user/messages/messages.component';
import { UserConversationsComponent } from './components/pages/user/conversations/conversations.component';
import { UserFollowersComponent } from './components/pages/user/followers/followers.component';
import { UserFollowingsComponent } from './components/pages/user/followings/followings.component';
import { VerifyStripeAccountComponent } from './components/pages/verify-stripe-account/verify-stripe-account.component';
import { CsrfProvider } from 'projects/common/src/app/interceptors/csrf.interceptor';
import { FaqPageComponent } from './components/pages/faq-page/faq-page.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    WelcomeComponent,
    SignupComponent,
    SigninComponent,
    AboutComponent,
    ContactComponent,
    TermsAgreementsComponent,
    PrivacyPolicyComponent,
    SignoutComponent,

    UserHomeFragmentComponent,
    UserSettingsFragmentComponent,
    UserPageComponent,
    UserNotificationsFragmentComponent,
    UserFieldsComponent,
    UserVerifyStripeAccountFragmentComponent,
    UserMessagesFragmentComponent,
    UserConversationsComponent,
    UserFollowersComponent,
    UserFollowingsComponent,
    VerifyStripeAccountComponent,
    FaqPageComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ModernCommonModule,
    BrowserAnimationsModule,
  ],
  providers: [
    CsrfProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
