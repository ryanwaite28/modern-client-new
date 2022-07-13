import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAuthGuard } from 'projects/common/src/app/guards/auth.guard';
import { SignedInGuard } from 'projects/common/src/app/guards/signed-in.guard';
import { UserSubscriptionInfoResolver } from 'projects/common/src/app/resolvers/user-subscription-info.resolver';
import { UserResolver } from 'projects/common/src/app/resolvers/user.resolver';
import { CreateServiceRequestComponent } from './components/pages/create-service-request/create-service-request.component';
import { SearchPageComponent } from './components/pages/search-page/search-page.component';
import { MechanicSearchComponent } from './components/pages/search-page/mechanic-search/mechanic-search.component';
import { HomePageComponent } from './components/pages/user-page/home-page/home-page.component';
import { MechanicProfilePageComponent } from './components/pages/user-page/mechanic-profile-page/mechanic-profile-page.component';
import { UserMessagesFragmentComponent } from './components/pages/user-page/messages-page/messages.component';
import { UserNotificationsFragmentComponent } from './components/pages/user-page/notifications-page/notifications.component';
import { SettingsPageComponent } from './components/pages/user-page/settings-page/settings-page.component';
import { UserPageComponent } from './components/pages/user-page/user-page.component';
import { WelcomeComponent } from './components/pages/welcome/welcome.component';
import { MechanicProfileResolver } from './resolvers/mechanic-profile.resolver';
import { ServiceRequestSearchComponent } from './components/pages/search-page/service-request-search/service-request-search.component';
import { IsMechanicGuard } from './guards/is-mechanic.guard';
import { UserServiceRequestsComponent } from './components/pages/user-page/user-service-requests/user-service-requests.component';
import { MechanicServiceRequestsComponent } from './components/pages/user-page/mechanic-service-requests/mechanic-service-requests.component';
import { MechanicPageComponent } from './components/pages/user-page/mechanic-page/mechanic-page.component';
import { MechanicServiceRequestOffersPageComponent } from './components/pages/user-page/mechanic-service-request-offers-page/mechanic-service-request-offers-page.component';
import { NotificationsPageComponent } from './components/pages/user-page/notifications-page/notifications-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'welcome' },
  { path: 'welcome', pathMatch: 'full', component: WelcomeComponent },

  {
    path: 'search',
    component: SearchPageComponent,
    children: [
      {
        path: 'mechanics',
        pathMatch: 'full',
        component: MechanicSearchComponent,
      },
      {
        path: 'service-requests',
        pathMatch: 'full',
        component: ServiceRequestSearchComponent,
        canActivate: [SignedInGuard, IsMechanicGuard]
      },
    ]
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
    },
    data: { authParamsProp: 'user_id' },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      
      { path: 'home', component: HomePageComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      {
        path: 'mechanic',
        component: MechanicPageComponent,
        resolve: {
          mechanic_profile: MechanicProfileResolver,
        },
        data: { authParamsProp: 'user_id' },
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'profile' },
          { path: 'profile', component: MechanicProfilePageComponent },
          { path: 'service-requests', component: MechanicServiceRequestsComponent, canActivate: [UserAuthGuard, IsMechanicGuard], data: { authParamsProp: 'user_id' } },
          { path: 'service-request-offers', component: MechanicServiceRequestOffersPageComponent, canActivate: [UserAuthGuard, IsMechanicGuard], data: { authParamsProp: 'user_id' } },
        ]
      },

      // { path: 'settings', component: SettingsPageComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },

      { path: 'notifications', component: NotificationsPageComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      { path: 'messages', component: UserMessagesFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      { path: 'user-service-requests', component: UserServiceRequestsComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
