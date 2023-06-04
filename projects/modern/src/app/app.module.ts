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
import { TechnicalDetailsPageComponent } from './components/pages/technical-details-page/technical-details-page.component';
import { SecurityProtectionPageComponent } from './components/pages/security-protection-page/security-protection-page.component';
import { DecimalPipe } from '@angular/common';
import { CREATE_APP_INIT_SOCKET_EVENTS_PROVIDER } from 'projects/common/src/app/_misc/app-init';
import { MODERN_APPS } from 'projects/common/src/app/enums/all.enums';

import { DeliverMeDeliveryBrowseFeaturedPageComponent } from './components/pages/delivery-browse-featured/delivery-browse-featured.component';
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
import { DeliveryCardComponent } from './components/fragments/delivery-card/delivery-card.component';
import { DeliveryFormComponent } from './components/fragments/delivery-form/delivery-form.component';
import { DELIVERME_EVENT_TYPES } from './enums/deliverme.enum';
import { TutorialsMainPageComponent } from './components/pages/tutorials-main-page/tutorials-main-page.component';
import { TutorialInstallingAppPageComponent } from './components/pages/tutorials-main-page/tutorial-installing-app-page/tutorial-installing-app-page.component';
import { TutorialSignupPageComponent } from './components/pages/tutorials-main-page/tutorial-signup-page/tutorial-signup-page.component';
import { TutorialLoginPageComponent } from './components/pages/tutorials-main-page/tutorial-login-page/tutorial-login-page.component';
import { TutorialInitialScreenPageComponent } from './components/pages/tutorials-main-page/tutorial-initial-screen-page/tutorial-initial-screen-page.component';
import { TutorialSettingUpStripeConnectPageComponent } from './components/pages/tutorials-main-page/tutorial-setting-up-stripe-connect-page/tutorial-setting-up-stripe-connect-page.component';
import { TutorialStripeCustomerAccountPageComponent } from './components/pages/tutorials-main-page/tutorial-stripe-customer-account-page/tutorial-stripe-customer-account-page.component';
import { TutorialCreateDeliveryListingPageComponent } from './components/pages/tutorials-main-page/tutorial-create-delivery-listing-page/tutorial-create-delivery-listing-page.component';
import { TutorialSearchFulfillDeliveryListingPageComponent } from './components/pages/tutorials-main-page/tutorial-search-fulfill-delivery-listing-page/tutorial-search-fulfill-delivery-listing-page.component';
import { TutorialViewStripeConnectedAccountProfilePageComponent } from './components/pages/tutorials-main-page/tutorial-view-stripe-connected-account-profile-page/tutorial-view-stripe-connected-account-profile-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordResetPageComponent } from './components/pages/password-reset-page/password-reset-page.component';
import { VerifyPasswordResetPageComponent } from './components/pages/verify-password-reset-page/verify-password-reset-page.component';
import { BackgroundStoryPageComponent } from './components/pages/background-story-page/background-story-page.component';
import { AppDemoVideoPageComponent } from './components/pages/app-demo-video-page/app-demo-video-page.component';
import { StripeConnectOnboardingRedirectPageComponent } from './components/pages/stripe-connect-onboarding-redirect-page/stripe-connect-onboarding-redirect-page.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReleaseNotesPageComponent } from './components/pages/release-notes-page/release-notes-page.component';
import { HelpPageComponent } from './components/pages/help-page/help-page.component';



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
    PasswordResetPageComponent,

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
    TechnicalDetailsPageComponent,
    SecurityProtectionPageComponent,

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
    TutorialsMainPageComponent,
    TutorialInstallingAppPageComponent,
    TutorialSignupPageComponent,
    TutorialLoginPageComponent,
    TutorialInitialScreenPageComponent,
    TutorialSettingUpStripeConnectPageComponent,
    TutorialStripeCustomerAccountPageComponent,
    TutorialCreateDeliveryListingPageComponent,
    TutorialSearchFulfillDeliveryListingPageComponent,
    TutorialViewStripeConnectedAccountProfilePageComponent,
    VerifyPasswordResetPageComponent,
    BackgroundStoryPageComponent,
    AppDemoVideoPageComponent,
    StripeConnectOnboardingRedirectPageComponent,
    ReleaseNotesPageComponent,
    HelpPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ModernCommonModule,
    BrowserAnimationsModule,
    MatSnackBarModule
  ],
  providers: [
    CsrfProvider,
    CREATE_APP_INIT_SOCKET_EVENTS_PROVIDER(MODERN_APPS.DELIVERME, DELIVERME_EVENT_TYPES),
    DecimalPipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
