import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IMechanic } from 'projects/carmaster/src/app/interfaces/carmaster.interface';
import { PlainObject } from 'projects/common/src/app/interfaces/json-object.interface';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { IUserSubscriptionInfo } from 'projects/common/src/app/interfaces/_common.interface';
import { EnvironmentService } from 'projects/common/src/app/services/environment.service';
import { GoogleMapsService } from 'projects/common/src/app/services/google-maps.service';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { COMMON_TEXT_FORM_LIMIT } from 'projects/common/src/app/_misc/vault';
import { combineLatest, Subscription } from 'rxjs';



@Component({
  selector: 'carmaster-mechanic-profile-page',
  templateUrl: './mechanic-profile-page.component.html',
  styleUrls: ['./mechanic-profile-page.component.scss']
})
export class MechanicProfilePageComponent implements OnInit, AfterViewInit {
  you: IUser | null = null;
  user: IUser | null = null;
  user_subscription_info: IUserSubscriptionInfo | null = null;
  TEXT_FORM_LIMIT = COMMON_TEXT_FORM_LIMIT;
  locationInput?: HTMLInputElement;
  googleIsReadySub?: Subscription;
  autocomplete?: any;
  manage: PlainObject = {};
  cityQuery?: string;
  zipcodeQuery?: string;
  placeData: PlainObject = {};
  mechanic_profile: IMechanic | null = null;

  profileForm = new FormGroup({
    bio: new FormControl('', []),
    website: new FormControl('', []),
    phone: new FormControl('', []),
    email: new FormControl('', []),
  });

  get isYou(): boolean {
    const isYours = (
      this.you && 
      this.user &&
      this.user.id === this.you.id
    );
    return !!isYours;
  };

  get isUserActiveMember(): boolean {
    const match = !!this.user_subscription_info && this.user_subscription_info.active;
    return match;
  }

  constructor(
    private userStore: UserStoreService,
    private userService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private googleService: GoogleMapsService,
    private envService: EnvironmentService,
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.userStore.getChangesObs(),
      this.route.parent!.data
    ]).subscribe({
      next: (values) => {
        console.log(values);

        const you = values[0];
        const data = values[1];
        
        this.you = you;

        this.user = data['user'];
        this.user_subscription_info = data['user_subscription_info'];
        this.mechanic_profile = data['mechanic_profile'];

        if (this.isYou && !!this.mechanic_profile) {
          this.profileForm.setValue({
            bio: this.mechanic_profile.bio || '',
            website: this.mechanic_profile.website || '',
            phone: this.mechanic_profile.phone || '',
            email: this.mechanic_profile.email || '',
          });
        }
      }
    });

  }
  
  ngAfterViewInit() {
    this.locationInput = <HTMLInputElement> window.document.getElementById('location-input');
    console.log('location-input', this.locationInput);
    this.googleIsReadySub = this.googleService.isReady().subscribe(
      (google: any) => {
        if (google) {
          if (this.googleIsReadySub) {
            this.googleIsReadySub.unsubscribe();
          }
          this.initGoogle(google);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  initGoogle(google: any) {
    if (this.autocomplete) {
      return;
    }
    console.log(`initializing autocomplete`);
    this.autocomplete = new google.maps.places.Autocomplete(this.locationInput);
    google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
      var place = this.autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }
      
      this.manage['place'] = place;
      this.manage['formatted_address'] = place.formatted_address;
      this.manage['latitude'] = place.geometry.location.lat();
      this.manage['longitude'] = place.geometry.location.lng();

      
      this.placeData = {};
      
      // Get each component of the address from the place details
      // and fill the corresponding field on the form.
      for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (this.googleService.componentForm[addressType]) {
          var val = place.address_components[i][this.googleService.componentForm[addressType]];
          this.placeData[this.googleService.switchName(addressType)] = val;
          var elm = document.getElementById(addressType);
          if (elm) { (<any> elm).value = val; };
        }
      }
      if(!this.placeData['city']) {
        this.placeData['city'] = '';
      }
      if(!this.placeData['state']) {
        this.placeData['state'] = '';
      }

      const { city, country, zipcode, route, state, street_number } = this.placeData;
      const location = `${street_number} ${route}, ${city}, ${state} ${zipcode}, ${country}`.trim();
      this.placeData['location'] = location;
      this.placeData['address'] = this.manage['formatted_address'];
      this.placeData['lat'] = this.manage['latitude'];
      this.placeData['lng'] = this.manage['longitude'];

      console.log(this.placeData, place, JSON.stringify(place));
    });
  }

  onProfileInfoSubmit() {

  }
}
