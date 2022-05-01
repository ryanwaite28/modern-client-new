import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAuthGuard } from 'projects/common/src/app/guards/auth.guard';
import { UserResolver } from 'projects/common/src/app/resolvers/user.resolver';
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
import { DeliverMeUserHomeComponent } from './components/pages/user/home/home.component';
import { DeliverMeUserSettingsFragmentComponent } from './components/pages/user/settings/settings.component';
import { DeliverMeUserPageComponent } from './components/pages/user/user-page.component';
import { WelcomeComponent } from './components/pages/welcome/welcome.component';
import { DeliveryResolver } from './resolvers/delivery.resolver';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'welcome' },
  { path: 'welcome', pathMatch: 'full', component: WelcomeComponent },

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
    component: DeliverMeUserPageComponent,
    resolve: {
      user: UserResolver,
    },
    data: { authParamsProp: 'user_id' },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
  
      { path: 'home', component: DeliverMeUserHomeComponent },
      { path: 'settings', component: DeliverMeUserSettingsFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      { path: 'create-delivery', component: DeliverMeUserCreateDeliveryFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      { path: 'deliveries', component: DeliverMeUserDeliveriesFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      { path: 'delivering', component: DeliverMeUserDeliveringFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
      { path: 'search', component: DeliverMeUserDeliverySearchFragmentComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
