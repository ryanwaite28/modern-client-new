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
