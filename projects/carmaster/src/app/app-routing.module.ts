import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAuthGuard } from 'projects/common/src/app/guards/auth.guard';
import { SignedInGuard } from 'projects/common/src/app/guards/signed-in.guard';
import { UserSubscriptionInfoResolver } from 'projects/common/src/app/resolvers/user-subscription-info.resolver';
import { UserResolver } from 'projects/common/src/app/resolvers/user.resolver';
import { CreateServiceRequestComponent } from './components/pages/create-service-request/create-service-request.component';
import { MechanicSearchComponent } from './components/pages/mechanic-search/mechanic-search.component';
import { HomePageComponent } from './components/pages/user-page/home-page/home-page.component';
import { MechanicProfilePageComponent } from './components/pages/user-page/mechanic-profile-page/mechanic-profile-page.component';
import { SettingsPageComponent } from './components/pages/user-page/settings-page/settings-page.component';
import { UserPageComponent } from './components/pages/user-page/user-page.component';
import { WelcomeComponent } from './components/pages/welcome/welcome.component';
import { MechanicProfileResolver } from './resolvers/mechanic-profile.resolver';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'welcome' },
  { path: 'welcome', pathMatch: 'full', component: WelcomeComponent },
  {
    path: 'mechanic-search',
    pathMatch: 'full',
    component: MechanicSearchComponent,
  },
  {
    path: 'create-service-request',
    pathMatch: 'full',
    component: CreateServiceRequestComponent,
    canActivate: [SignedInGuard]
  },

  {
    path: 'users/:user_id',
    component: UserPageComponent,
    resolve: {
      user: UserResolver,
      user_subscription_info: UserSubscriptionInfoResolver,
      mechanic_profile: MechanicProfileResolver,
    },
    data: { authParamsProp: 'user_id' },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'mechanic-profile' },
  
      { path: 'home', component: HomePageComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      { path: 'mechanic-profile', component: MechanicProfilePageComponent },
      // { path: 'settings', component: SettingsPageComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
