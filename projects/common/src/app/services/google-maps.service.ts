import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { PlainObject } from '../interfaces/json-object.interface';
import { INavigatorGeoLocation } from '../interfaces/_common.interface';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private google: any;
  private isReadyStream = new BehaviorSubject<any>(null);
  readonly componentForm: PlainObject = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    administrative_area_level_2: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
  };

  private loading = false;

  get mapsIsReady(): boolean {
    return !!this.google;
  }

  constructor(
    private clientService: ClientService
  ) {}

  // called by app initializer, xsrf-token should be available by now
  loadGoogleMaps() {
    return this.clientService.sendRequest<{ data: string }>(`/common/utils/get-google-api-key`, 'POST')
      .pipe(flatMap((response: any, index: number) => {
        return this.getGoogleMaps(response.data.key);
      }))
  }

  get_distance_spherical_api(params: {
    from_lat: number;
    from_lng: number;
    to_lat: number;
    to_lng: number;
  }) {
    /* 
      https://developers.google.com/maps/documentation/javascript/reference/geometry?hl=en-US#spherical.computeDistanceBetween
      https://stackoverflow.com/questions/1502590/calculate-distance-between-two-points-in-google-maps-v3
    */
    const lat_lng_a = new this.google.maps.LatLng(params.from_lat, params.from_lng);
    const lat_lng_b = new this.google.maps.LatLng(params.to_lat, params.to_lng);
    const distance = (this.google.maps.geometry.spherical.computeDistanceBetween(lat_lng_a, lat_lng_b) / 1000).toFixed(2);
    console.log({ distance });
    return parseFloat(distance);
  }

  get_distance_haversine_distance(params: {
    from_lat: number;
    from_lng: number;
    to_lat: number;
    to_lng: number;
  }) {
    /*  
      https://developers.google.com/maps/documentation/distance-matrix/overview#DistanceMatrixRequests
      https://cloud.google.com/blog/products/maps-platform/how-calculate-distances-map-maps-javascript-api
    */
    var M = 3958.8; // Radius of the Earth in miles
    var K = 6371.0710; // Radius of the Earth in kilometers

    var rlat1 = params.from_lat * (Math.PI/180); // Convert degrees to radians
    var rlat2 = params.to_lat * (Math.PI/180); // Convert degrees to radians
    var difflat = rlat2-rlat1; // Radian difference (latitudes)
    var difflon = (params.to_lng - params.from_lng) * (Math.PI/180); // Radian difference (longitudes)

    var d = 2 * M * Math.asin(
      Math.sqrt(
        Math.sin(difflat/2) * Math.sin(difflat/2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon/2) * Math.sin(difflon/2)
      )
    );
    return d;
  }

  private getGoogleMaps(google_api_key: string) {
    if (this.loading) {
      console.log('already loading google maps...');
      return this.isReady();
    }

    return new Observable<any>((observer) => {
      if (!google_api_key) {
        const e = new TypeError(`google_api_key has no value; cannot load google maps`);
        this.isReadyStream.error(e);
        observer.error(e);
        observer.complete();
        return;
      }

      if (this.google) {
        this.isReadyStream.next(this.google);
        observer.next(this.google);
        observer.complete();
        return;
      }

      const googleScript = document.createElement('script');
      googleScript.setAttribute('async', 'true');
      googleScript.setAttribute('defer', 'true');
      const srcUrl = `https://maps.googleapis.com/maps/api/js?key=${google_api_key}&libraries=places,geometry&callback=initMap`;
      googleScript.setAttribute('src', srcUrl);

      const wd = (<any> window);
      wd['initMap'] = () => {
        this.google = wd['google'];
        if (this.google) {
          console.log('google maps loaded.', this);
          this.isReadyStream.next(this.google);
          observer.next(this.google);
        } else {
          console.log('google maps was not loaded.', this);
          const e = new Error(`google maps was not loaded.`);
          this.isReadyStream.error(e);
          observer.error(e);
        }

        document.body.removeChild(googleScript);
        observer.complete();
      };

      document.body.appendChild(googleScript);
    });
  }

  isReady() {
    return this.isReadyStream.asObservable();
  }

  makeTextInputIntoLocationAutoComplete(
    locationInput: HTMLInputElement,
    mapBox?: HTMLDivElement
  ): Subject<{ manage: PlainObject; placeData: PlainObject; }> {
    const google = this.google;
    if (!google) {
      throw new ReferenceError(`makeTextInputIntoLocationAutoComplete() error: Google maps API is not loaded...`);
    }

    const manage: any = {
      map: (!!mapBox || null) && new google.maps.Map(mapBox, {
        center: {
          lat: 39.173303,
          lng: -77.177274
        },
        scrollwheel: true,
        zoom: 5
      }),
      marker: null,
      place: {},
      infowindow: new google.maps.InfoWindow(),
      input: locationInput,
      autocomplete: new google.maps.places.Autocomplete(locationInput),
    };

    if (mapBox) {
      manage.autocomplete.bindTo('bounds', manage.map);
      manage.map.controls[google.maps.ControlPosition.TOP_LEFT].push(manage.input);
      manage.marker = new google.maps.Marker({
        map: manage.map,
      });
      manage.marker.clearLocation = function() {
        manage.marker.place_id = false;
        manage.marker.location = false;
        manage.marker.latitude = false;
        manage.marker.longitude = false;
        console.log("location cleared");
      }
    }
    
    // create by-directional communicator
    const place_changes = new Subject<{ manage: PlainObject; placeData: PlainObject; }>();

    const place_changed_success_callback = () => {
      manage.infowindow.close();
      var place = manage.autocomplete.getPlace();
      Object.assign(manage.place, place);

      if (!place.geometry) {
        return;
      }

      if (mapBox && place.geometry.viewport) {
        manage.map.fitBounds(place.geometry.viewport);
        manage.map.setCenter(place.geometry.location);
        manage.map.setZoom(17);
      }

      console.log(place);
      if (mapBox) {
        manage.marker.place_id = place.place_id;
        manage.marker.location = place.formatted_address;
        manage.marker.latitude = place.geometry.location.lat();
        manage.marker.longitude = place.geometry.location.lng();

        // Set the position of the marker using the place ID and location.
        manage.marker.setPlace( /** @type {!google.maps.Place} */ ({
          placeId: place.place_id,
          location: place.geometry.location
        }));
        manage.marker.setVisible(true);

        manage.infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
          'Place ID: ' + place.place_id + '<br>' +
          place.formatted_address +
          '</div>'
        );

        manage.infowindow.open(manage.map, manage.marker);
      }

      const formatted_address = place.formatted_address;
      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();
      const placeData: any = {};
      
      // Get each component of the address from the place details
      // and fill the corresponding field on the form.
      for (var i = 0; i < place.address_components.length; i++) {
        // var addressType = place.address_components[i].types[0];
        for (const t of place.address_components[i].types) {
          if (this.componentForm[t]) {
            var val = place.address_components[i][this.componentForm[t]];
            placeData[this.switchName(t)] = val;
            var elm = document.getElementById(t);
            if (elm) { (<any> elm).value = val; };
          }
        }
      }
      if (!placeData['city']) {
        placeData['city'] = '';
      }
      if (!placeData['state']) {
        placeData['state'] = '';
      }

      const { city, country, zipcode, route, state, street_number } = placeData;
      const location = `${street_number} ${route}, ${city}, ${state} ${zipcode}, ${country}`.trim();
      placeData.location = location;
      placeData.address = formatted_address;
      placeData.lat = latitude;
      placeData.lng = longitude;

      // emit data
      place_changes.next({ manage, placeData });
    };

    // Get the full place details when the user selects a place from the list of suggestions.
    google.maps.event.addListener(manage.autocomplete, 'place_changed', place_changed_success_callback);

    const sub = place_changes.subscribe({
      next: () => {},
      error: () => {},
      complete: () => {
        // caller should communicate when it is done with this subject
        console.log(`removing listener...`);
        google.maps.event.clearInstanceListeners(manage.autocomplete);
        console.log(`removed listener.`);
        if (sub) {
          sub?.unsubscribe();
        }
      }
    });

    Object.freeze(manage);

    return place_changes;
  }

  switchName(name: string) {
    switch(name) {
      case 'locality':
        return 'city';
      case 'administrative_area_level_1':
        return 'state';
      case 'administrative_area_level_2':
          return 'county';
      case 'country':
        return 'country';
      case 'postal_code':
        return 'zipcode';

      default:
        return name;
    }
  }

  getCurrentLocation(): Observable<INavigatorGeoLocation> {
    // https://developers.google.com/web/fundamentals/native-hardware/user-location
    return new Observable((observer) => {
      // check for Geolocation support
      if (navigator.geolocation) {
        console.log('Geolocation is supported!');
      }
      else {
        const errMsg = 'Geolocation is not supported for this Browser/OS.';
        console.log(errMsg);
        observer.error({
          message: errMsg
        });
        observer.complete();
        return;
      }

      let nudgeTimeoutId = setTimeout(() => {}, 5000);

      const geoSuccess = (position: any) => {
        // We have the location, don't display banner
        clearTimeout(nudgeTimeoutId);
        console.log(position);
        observer.next({
          position: position,
          lat: position.coords.latitude as number,
          lng: position.coords.longitude as number,
        });
        observer.complete();
      };
      const geoError = (error: any) => {
        console.log(error);

        switch(error.code) {
          case error.TIMEOUT: {
            // The user didn't accept the callout
            observer.error({
              message: `Geolocation error`,
              error
            });
            break;
          }
        }

        observer.complete();
      };
    
      navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    });
  }

  getLocationViaCoordinates(lat: number, lng: number) {
    // https://developers.google.com/maps/documentation/javascript/geocoding#ReverseGeocoding
    return new Observable((observer) => {
      if (!lat || !lng) {
        observer.error({ message: 'both lat and lng arguments are required.' });
        observer.complete();
        return;
      }
      const geocoder = new this.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }).then((response: any) => {
        // console.log(response);
        const place = response.results[0];
        if (place) {
          const placeData: any = {};
          
          // Get each component of the address from the place details
          // and fill the corresponding field on the form.
          for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (this.componentForm[addressType]) {
              var val = place.address_components[i][this.componentForm[addressType]];
              placeData[this.switchName(addressType)] = val;
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
          
          const emitData = {
            place,
            placeData
          };
          // console.log(emitData);

          observer.next(emitData);
          observer.complete();
        } else {
          const errMsg = "No results found";
          console.log(errMsg);
          observer.error({
            message: errMsg
          });
          observer.complete();
          return;
        }
      }).catch((e: any) => {
        const errMsg = "Geocoder failed due to: " + e;
        console.log(errMsg);
        observer.error({
          message: errMsg
        });
        observer.complete();
        return;
      });
    });
  }
}
