import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { GoogleMapsService } from 'projects/common/src/app/services/google-maps.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { DeliveryService } from 'projects/deliverme/src/app/services/delivery.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'deliverme-delivery-search',
  templateUrl: './delivery-search.component.html',
  styleUrls: ['./delivery-search.component.scss']
})
export class DeliverMeUserDeliverySearchFragmentComponent implements OnInit {
  @ViewChild('fromLocationInput') fromLocationInput: ElementRef<HTMLInputElement> | any;
  @ViewChild('toLocationInput') toLocationInput: ElementRef<HTMLInputElement> | any;
  
  you: any;
  loading: boolean = false;
  firstSearch: boolean = true;
  search_deliveries_results: any = [];
  searchDeliveriesForm = new UntypedFormGroup({
    from_city: new UntypedFormControl('', []),
    from_state: new UntypedFormControl('', []),
    to_city: new UntypedFormControl('', []),
    to_state: new UntypedFormControl('', []),
  });

  google: any;
  googleSub: Subscription | any;
  map: any;
  fromAutocomplete: any;
  toAutocomplete: any;
  fromPlaceData: any = {};
  toPlaceData: any = {};
  searchError = '';

  constructor(
    private userStore: UserStoreService,
    private alertService: AlertService,
    private deliveryService: DeliveryService,
    private googleMapsService: GoogleMapsService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe((you: IUser | null) => {
      this.you = you;
    });
  }
  
  ngAfterViewInit() {
    this.googleSub = this.googleMapsService.isReady().subscribe(
      (google) => {
        if (google) {
          this.google = google;
          this.initGoogleAutoComplete(google);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  initGoogleAutoComplete(google: any) {
    this.fromAutocomplete = new google.maps.places.Autocomplete(this.fromLocationInput?.nativeElement);
    this.toAutocomplete = new google.maps.places.Autocomplete(this.toLocationInput?.nativeElement);

    this.setAutocompleteCallback(google, this.fromAutocomplete, this.fromPlaceData, () => {
      this.searchDeliveriesForm.get('from_city')!.setValue(this.fromPlaceData.city);
      this.searchDeliveriesForm.get('from_state')!.setValue(this.fromPlaceData.state);
      this.searchDeliveriesForm.updateValueAndValidity();
      this.changeDetectorRef.detectChanges();
    });
    this.setAutocompleteCallback(google, this.toAutocomplete, this.toPlaceData, () => {
      this.searchDeliveriesForm.get('to_city')!.setValue(this.toPlaceData.city);
      this.searchDeliveriesForm.get('to_state')!.setValue(this.toPlaceData.state);
      this.searchDeliveriesForm.updateValueAndValidity();
      this.changeDetectorRef.detectChanges();
    });
  }

  setAutocompleteCallback(
    google: any,
    autocomplete: any,
    placeData: any,
    cb?: () => any
  ) {
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }

      // reset
      Object.keys(placeData).forEach((key) => {
        placeData[key] = undefined;
      });
      
      // Get each component of the address from the place details
      // and fill the corresponding field on the form.
      for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (this.googleMapsService.componentForm[addressType]) {
          var val = place.address_components[i][this.googleMapsService.componentForm[addressType]];
          placeData[this.googleMapsService.switchName(addressType)] = val;
        }
      }
      if(!placeData['city']) {
        placeData['city'] = '';
      }
      if(!placeData['state']) {
        placeData['state'] = '';
      }

      const { city, country, zipcode, route, state, street_number } = placeData;
      const location = `${place.name ? (place.name + ' - ') : ''}${street_number ? (street_number + ' ') : ''}${route ? (route + ', ') : ''}${city ? (city + ', ') : ''}${state || ''}${zipcode ? (' ' + zipcode + ', ') : ', '}${country ? (country + ' ') : ''}`.trim().replace(/[\s]{2,}/, ' ');
      
      placeData.location = location;
      placeData.address = place.formatted_address;
      placeData.lat = place.geometry.location.lat();
      placeData.lng = place.geometry.location.lng();
      placeData.place_id = place.place_id;

      if (cb) {
        cb();
      }
    });
  }

  onSubmitSearchDeliveriesForm() {
    this.loading = true;
    if (this.firstSearch) {
      this.firstSearch = false;
    }
    this.deliveryService.searchDeliveries(this.searchDeliveriesForm.value).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.searchError = '';
        this.search_deliveries_results = response.data;
      },
      error: (error: HttpErrorResponse) => {
        this.searchError = error.error.message;
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  assignDelivery(delivery: any) {
    const ask = window.confirm(`Are you sure you want to take this delivery?`);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.deliveryService.assignDelivery<any>(this.you!.id, delivery.id).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.alertService.handleResponseSuccessGeneric(response);
        this.router.navigate(['/', 'modern', 'apps', 'deliverme', 'users', this.you!.id, 'delivering']);
      },
      error: (error: any) => {
        this.loading = false;
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
