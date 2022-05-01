import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PhonePipe } from './pipes/phone.pipe';
import { StripeAmountFormatterPipe } from './pipes/stripe-amount-formatter.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { UserFullNamePipe } from './pipes/user-full-name.pipe';
import { AlertService } from './services/alert.service';
import { ClientService } from './services/client.service';
import { EnvironmentService } from './services/environment.service';
import { GoogleMapsService } from './services/google-maps.service';
import { SocketEventsService } from './services/socket-events.service';
import { StripeService } from './services/stripe.service';
import { UsersService } from './services/users.service';
import { UtilityService } from './services/utility.service';
import { UserStoreService } from './stores/user-store.service';
import { APP_INIT_PROVIDER } from './_misc/app-init';

import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonAlertsFragmentComponent } from './components/alerts-fragment/alerts-fragment.component';
import { BackgroundImageCoverDirective } from './directives/background-image-cover.directive';
import { UserProfileCardComponent } from './components/user-profile-card/user-profile-card.component';


@NgModule({
  declarations: [
    PhonePipe,
    StripeAmountFormatterPipe,
    TimeAgoPipe,
    UserFullNamePipe,

    CommonAlertsFragmentComponent,
    BackgroundImageCoverDirective,
    UserProfileCardComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    
    FormsModule,
    ReactiveFormsModule,
    
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,

    // DatePipe,
  ],
  exports: [
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,

    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    PhonePipe,
    StripeAmountFormatterPipe,
    TimeAgoPipe,
    UserFullNamePipe,
    // DatePipe,

    CommonAlertsFragmentComponent,
    UserProfileCardComponent,
    BackgroundImageCoverDirective,
  ],
  providers: [
    APP_INIT_PROVIDER,

    HttpClientModule,
    MatIconRegistry,

    PhonePipe,
    StripeAmountFormatterPipe,
    TimeAgoPipe,
    UserFullNamePipe,
    DatePipe,

    AlertService,
    ClientService,
    EnvironmentService,
    GoogleMapsService,
    SocketEventsService,
    StripeService,
    UsersService,
    UserStoreService,
    UtilityService,
  ],
})
export class ModernCommonModule { }
