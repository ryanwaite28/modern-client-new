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
import { WelcomeComponent } from './components/pages/welcome/welcome.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'welcome' },
  { path: 'welcome', pathMatch: 'full', component: WelcomeComponent },
  { path: 'about', pathMatch: 'full', component: AboutComponent },
  { path: 'contact', pathMatch: 'full', component: ContactComponent },
  { path: 'terms-agreements', pathMatch: 'full', component: TermsAgreementsComponent },
  { path: 'privacy-policy', pathMatch: 'full', component: PrivacyPolicyComponent },
  { path: 'signup', pathMatch: 'full', component: SignupComponent, canActivate: [SignedOutGuard] },
  { path: 'signin', pathMatch: 'full', component: SigninComponent, canActivate: [SignedOutGuard] },
  { path: 'signout', pathMatch: 'full', component: SignoutComponent, canActivate: [SignedInGuard] },

  {
    path: 'users/:user_id',
    component: UserPageComponent,
    resolve: {
      user: UserResolver,
    },
    data: { authParamsProp: 'user_id' },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      
      { path: 'home', component: UserHomeFragmentComponent },
      { path: 'settings', component: UserSettingsFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      { path: 'notifications', component: UserNotificationsFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      { path: 'messages', component: UserMessagesFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      { path: 'conversations', component: UserConversationsComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      { path: 'verify-stripe-account', component: UserVerifyStripeAccountFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
