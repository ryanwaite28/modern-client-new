import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAuthGuard } from 'projects/common/src/app/guards/auth.guard';
import { SignedOutGuard } from 'projects/common/src/app/guards/signed-out.guard';
import { UserResolver } from 'projects/common/src/app/resolvers/user.resolver';
import { AboutComponent } from './components/pages/about/about.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { PrivacyPolicyComponent } from './components/pages/privacy-policy/privacy-policy.component';
import { SigninComponent } from './components/pages/signin/signin.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { TermsAgreementsComponent } from './components/pages/terms-agreements/terms-agreements.component';
import { HomeComponent } from './components/pages/user/home/home.component';
import { SettingsComponent } from './components/pages/user/settings/settings.component';
import { UserComponent } from './components/pages/user/user.component';
import { WelcomeComponent } from './components/pages/welcome/welcome.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: WelcomeComponent },
  { path: 'welcome', pathMatch: 'full', component: WelcomeComponent },
  { path: 'about', pathMatch: 'full', component: AboutComponent },
  { path: 'contact', pathMatch: 'full', component: ContactComponent },
  { path: 'terms-agreements', pathMatch: 'full', component: TermsAgreementsComponent },
  { path: 'privacy-policy', pathMatch: 'full', component: PrivacyPolicyComponent },
  { path: 'signup', pathMatch: 'full', component: SignupComponent, canActivate: [SignedOutGuard] },
  { path: 'signin', pathMatch: 'full', component: SigninComponent, canActivate: [SignedOutGuard] },

  {
    path: 'users/:user_id',
    component: UserComponent,
    resolve: {
      user: UserResolver,
    },
    data: { authParamsProp: 'user_id' },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      
      { path: 'home', component: HomeComponent },
      { path: 'settings', component: SettingsComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
