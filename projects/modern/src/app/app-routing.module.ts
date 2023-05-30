import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAuthGuard } from 'projects/common/src/app/guards/auth.guard';
import { SignedInGuard } from 'projects/common/src/app/guards/signed-in.guard';
import { SignedOutGuard } from 'projects/common/src/app/guards/signed-out.guard';
import { UserResolver } from 'projects/common/src/app/resolvers/user.resolver';
import { AboutComponent } from './components/pages/about/about.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { PrivacyPolicyComponent } from './components/pages/privacy-policy/privacy-policy.component';
import { SigninComponent } from './components/pages/signin/signin.component';
import { SignoutComponent } from './components/pages/signout/signout.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { TermsAgreementsComponent } from './components/pages/terms-agreements/terms-agreements.component';
import { UserConversationsComponent } from './components/pages/user/conversations/conversations.component';
import { UserHomeFragmentComponent } from './components/pages/user/home/home.component';
import { UserMessagesFragmentComponent } from './components/pages/user/messages/messages.component';
import { UserNotificationsFragmentComponent } from './components/pages/user/notifications/notifications.component';
import { UserSettingsFragmentComponent } from './components/pages/user/settings/settings.component';
import { UserPageComponent } from './components/pages/user/user-page.component';
import { UserVerifyStripeAccountFragmentComponent } from './components/pages/user/verify-stripe-account-fragment/verify-stripe-account-fragment.component';
import { VerifyStripeAccountComponent } from './components/pages/verify-stripe-account/verify-stripe-account.component';
import { WelcomeComponent } from './components/pages/welcome/welcome.component';
import { FaqPageComponent } from './components/pages/faq-page/faq-page.component';
import { CommonVerifyEmailComponent } from './components/pages/verify-email/verify-email.component';
import { TechnicalDetailsPageComponent } from './components/pages/technical-details-page/technical-details-page.component';
import { SecurityProtectionPageComponent } from './components/pages/security-protection-page/security-protection-page.component';
import { DeliverMeUserCreateDeliveryFragmentComponent } from './components/pages/user/create-delivery/create-delivery.component';
import { DeliverMeUserDeliveriesFragmentComponent } from './components/pages/user/deliveries/deliveries.component';
import { DeliverMeUserDeliveringFragmentComponent } from './components/pages/user/delivering/delivering.component';
import { DeliverMeUserDeliverySearchFragmentComponent } from './components/pages/user/delivery-search/delivery-search.component';
import { DeliverMeDeliveryBrowseMapPageComponent } from './components/pages/delivery-browse-map/delivery-browse-map.component';
import { DeliverMeDeliveryBrowseRecentPageComponent } from './components/pages/delivery-browse-recent/delivery-browse-recent.component';
import { DeliverMeDeliveryContainerPageComponent } from './components/pages/delivery-container-page/delivery-container-page.component';
import { DeliverMeDeliveryPageComponent } from './components/pages/delivery-container-page/delivery-page/delivery-page.component';
import { DeliveryPaymentCancelPageComponent } from './components/pages/delivery-container-page/delivery-payment-cancel-page/delivery-payment-cancel-page.component';
import { DeliveryPaymentSuccessPageComponent } from './components/pages/delivery-container-page/delivery-payment-success-page/delivery-payment-success-page.component';
import { DeliveryResolver } from './resolvers/delivery.resolver';
import { TutorialsMainPageComponent } from './components/pages/tutorials-main-page/tutorials-main-page.component';
import { TutorialInstallingAppPageComponent } from './components/pages/tutorials-main-page/tutorial-installing-app-page/tutorial-installing-app-page.component';
import { TutorialInitialScreenPageComponent } from './components/pages/tutorials-main-page/tutorial-initial-screen-page/tutorial-initial-screen-page.component';
import { TutorialSignupPageComponent } from './components/pages/tutorials-main-page/tutorial-signup-page/tutorial-signup-page.component';
import { TutorialLoginPageComponent } from './components/pages/tutorials-main-page/tutorial-login-page/tutorial-login-page.component';
import { TutorialSettingUpStripeConnectPageComponent } from './components/pages/tutorials-main-page/tutorial-setting-up-stripe-connect-page/tutorial-setting-up-stripe-connect-page.component';
import { TutorialStripeCustomerAccountPageComponent } from './components/pages/tutorials-main-page/tutorial-stripe-customer-account-page/tutorial-stripe-customer-account-page.component';
import { TutorialCreateDeliveryListingPageComponent } from './components/pages/tutorials-main-page/tutorial-create-delivery-listing-page/tutorial-create-delivery-listing-page.component';
import { TutorialSearchFulfillDeliveryListingPageComponent } from './components/pages/tutorials-main-page/tutorial-search-fulfill-delivery-listing-page/tutorial-search-fulfill-delivery-listing-page.component';
import { TutorialViewStripeConnectedAccountProfilePageComponent } from './components/pages/tutorials-main-page/tutorial-view-stripe-connected-account-profile-page/tutorial-view-stripe-connected-account-profile-page.component';
import { PasswordResetPageComponent } from './components/pages/password-reset-page/password-reset-page.component';
import { VerifyPasswordResetPageComponent } from './components/pages/verify-password-reset-page/verify-password-reset-page.component';
import { BackgroundStoryPageComponent } from './components/pages/background-story-page/background-story-page.component';
import { AppDemoVideoPageComponent } from './components/pages/app-demo-video-page/app-demo-video-page.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'welcome' },
  { path: 'welcome', pathMatch: 'full', component: WelcomeComponent },
  { path: 'about', pathMatch: 'full', component: AboutComponent },
  { path: 'background', pathMatch: 'full', component: BackgroundStoryPageComponent },
  { path: 'contact', pathMatch: 'full', component: ContactComponent },
  { path: 'terms-agreements', pathMatch: 'full', component: TermsAgreementsComponent },
  { path: 'privacy-policy', pathMatch: 'full', component: PrivacyPolicyComponent },
  { path: 'technical-details', pathMatch: 'full', component: TechnicalDetailsPageComponent },
  { path: 'security-protection', pathMatch: 'full', component: SecurityProtectionPageComponent },
  { path: 'demo', pathMatch: 'full', component: AppDemoVideoPageComponent },
  { path: 'faq', pathMatch: 'full', component: FaqPageComponent },
  { path: 'password-reset', pathMatch: 'full', component: PasswordResetPageComponent },
  { path: 'verify-password-reset', pathMatch: 'full', component: VerifyPasswordResetPageComponent },
  { path: 'signup', pathMatch: 'full', component: SignupComponent, canActivate: [SignedOutGuard] },
  { path: 'signin', pathMatch: 'full', component: SigninComponent, canActivate: [SignedOutGuard] },
  { path: 'signout', pathMatch: 'full', component: SignoutComponent, canActivate: [SignedInGuard] },

  // Tutorial Pages
  {
    path: 'tutorials',
    component: TutorialsMainPageComponent,
    children: [
      { path: 'installing', component: TutorialInstallingAppPageComponent },
      { path: 'initial-screen', component: TutorialInitialScreenPageComponent },
      { path: 'signup', component: TutorialSignupPageComponent },
      { path: 'login', component: TutorialLoginPageComponent },
      { path: 'setting-up-stripe-connect', component: TutorialSettingUpStripeConnectPageComponent },
      { path: 'stripe-customer-account', component: TutorialStripeCustomerAccountPageComponent },
      { path: 'create-manage-delivery-listing', component: TutorialCreateDeliveryListingPageComponent },
      { path: 'search-fulfill-delivery-listing', component: TutorialSearchFulfillDeliveryListingPageComponent },
      { path: 'stripe-connect-account-profile', component: TutorialViewStripeConnectedAccountProfilePageComponent },
    ]
  },
  // END Tutorial Pages
  
  { path: 'verify-email/:uuid', pathMatch: 'full', component: CommonVerifyEmailComponent },
  { path: 'verify-stripe-account/:user_uuid', pathMatch: 'full', component: VerifyStripeAccountComponent },

  {
    path: 'deliveries/browse-recent',
    component: DeliverMeDeliveryBrowseRecentPageComponent,
    canActivate: [],
    data: { authParamsProp: 'user_id' }
  },
  {
    path: 'deliveries/browse-map',
    component: DeliverMeDeliveryBrowseMapPageComponent,
    canActivate: [],
    data: { authParamsProp: 'user_id' }
  },

  {
    path: 'deliveries/:delivery_id',
    component: DeliverMeDeliveryContainerPageComponent,
    resolve: {
      delivery: DeliveryResolver,
    },
    children: [
      { path: '', pathMatch: 'full', component: DeliverMeDeliveryPageComponent },
      { path: 'payment-success', component: DeliveryPaymentSuccessPageComponent },
      { path: 'payment-cancel', component: DeliveryPaymentCancelPageComponent },
    ]
  },

  {
    path: 'users/:user_id',
    component: UserPageComponent,
    resolve: {
      user: UserResolver,
    },
    data: { authParamsProp: 'user_id' },
    children: [
      { path: 'home', component: UserHomeFragmentComponent },
      { path: 'settings', component: UserSettingsFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      { path: 'notifications', component: UserNotificationsFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      { path: 'messages', component: UserMessagesFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      { path: 'conversations', component: UserConversationsComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      { path: 'verify-stripe-account', component: UserVerifyStripeAccountFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      { path: 'create-delivery', component: DeliverMeUserCreateDeliveryFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      { path: 'deliveries', component: DeliverMeUserDeliveriesFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      { path: 'delivering', component: DeliverMeUserDeliveringFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      { path: 'search', component: DeliverMeUserDeliverySearchFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      { path: '', pathMatch: 'full', redirectTo: 'home' },
    ]
  },

  { path: '**', redirectTo: 'welcome' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
