import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { ServiceMethodResultsInfo } from 'projects/common/src/app/interfaces/_common.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { GoogleMapsService } from 'projects/common/src/app/services/google-maps.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { Subscription } from 'rxjs';
import { DeliveryCardDisplayMode } from '../../../enums/deliverme.enum';
import { IDelivery } from '../../../interfaces/deliverme.interface';
import { DeliveryService } from '../../../services/delivery.service';

@Component({
  selector: 'deliverme-delivery-browse-map',
  templateUrl: './delivery-browse-map.component.html',
  styleUrls: ['./delivery-browse-map.component.scss']
})
export class DeliverMeDeliveryBrowseMapPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapDiv', {  }) mapDiv?: ElementRef<HTMLDivElement> | any;

  you: IUser | null = null;
  googleSub?: Subscription;
  loading: boolean = false;
  google: any;
  map: any;
  infowindow: any;
  directionsRenderer: any;
  directionsService: any;
  markersMap: any = {};
  destinationMarker: any;
  deliveries: IDelivery[] = [];
  // deliveriesMap: PlainObject<IDelivery> = {};
  DeliveryCardDisplayMode = DeliveryCardDisplayMode;
  coordinates?: {
    center: { lat: number, lng: number },
    northEast: { lat: number, lng: number },
    southWest: { lat: number, lng: number },
  };

  constructor(
    private userStore: UserStoreService,
    private googleMapsService: GoogleMapsService,
    private deliveryService: DeliveryService,
    private alertService: AlertService,
    private decimalPipe: DecimalPipe,
    private router: Router,
  ) { }

  ngOnInit() {
    this.userStore.getChangesObs().subscribe({
      next: (you: IUser | null) => {
        this.you = you;
      }
    });
  }

  ngOnDestroy(): void {
    this.googleSub?.unsubscribe();
  }

  ngAfterViewInit() {
    this.googleSub = this.googleMapsService.isReady().subscribe({
      next: (google) => {
        if (google) {
          this.google = google;
          this.initGoogleMaps();
        }
      }
    });
  }

  initGoogleMaps() {
    this.map = new this.google.maps.Map(this.mapDiv!.nativeElement, {
      center: {
        lat: 39.173303,
        lng: -77.177274
      },
      scrollwheel: true,
      zoom: 9,
    });

    this.infowindow = new this.google.maps.InfoWindow();
    this.directionsRenderer = new this.google.maps.DirectionsRenderer();
    this.directionsService = new this.google.maps.DirectionsService();

    this.directionsRenderer.setMap(this.map);

    this.google.maps.event.addListener(this.map, 'bounds_changed', () => {
      const bounds = this.map.getBounds();
      const center = bounds.getCenter();
      const northEast = bounds.getNorthEast();
      const southWest = bounds.getSouthWest();

      const coordinates = {
        center: { lat: center.lat(), lng: center.lng() },
        northEast: { lat: northEast.lat(), lng: northEast.lng() },
        southWest: { lat: southWest.lat(), lng: southWest.lng() },
      };
      this.coordinates = coordinates;

      // console.log({ bounds, center, northEast, southWest, coordinates });
    });
  }

  setBrowseData(deliveries: IDelivery[]) {
    this.deliveries = deliveries;
    const markersMap: any = {};
    // const deliveriesMap: PlainObject<IDelivery> = {};

    for (const delivery of deliveries) {
      // deliveriesMap[delivery.id] = delivery;
      const infoWindowContent = `<div class="infowindow-content-box">
        <h4>${delivery.title}</h4>
        <p>
          <strong>From:</strong><br>${delivery.from_location}<br/>
          <strong>To:</strong><br>${delivery.to_location}
        </p>
        </div>`;
        // <p><strong>Miles:</strong><br>${this.decimalPipe.transform(delivery.distance_miles)}</p>
        // <p><strong>Payout:</strong><br>${delivery.payout}</p>
        // <p><strong>Penalty:</strong><br>${delivery.penalty}</p>
      const marker = new this.google.maps.Marker({
        position: { lat: delivery.from_lat, lng: delivery.from_lng },
        animation: this.google.maps.Animation.DROP,
        map: this.map,
        title: delivery.title,
        delivery_id: delivery.id,
        infoWindowContent,
      });
      marker.addListener("click", () => {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(this.google.maps.Animation.BOUNCE);
        }
        setTimeout(function() {
          marker.setAnimation(null);
        }, 1500);
        this.infowindow.setContent(marker.infoWindowContent);
        this.infowindow.open({
          anchor: marker,
          map: this.map,
          shouldFocus: false,
        });

        this.directionsService
          .route({
            origin: { lat: delivery.from_lat, lng: delivery.from_lng },
            destination: { lat: delivery.to_lat, lng: delivery.to_lng },
            travelMode: this.google.maps.TravelMode.DRIVING,
          })
          .then((response: any) => {
            console.log(response);
            this.directionsRenderer.setDirections(response);
          })
          .catch((error: any) => {
            console.log(error);
            error?.message && window.alert(error?.message);
          });
      });

      markersMap[delivery.id] = marker;
    }

    this.markersMap = markersMap;
  }

  clearBrowseData() {
    this.deliveries = [];
    const markers: any[] = Object.values(this.markersMap);
    for (const marker of markers) {
      marker.setMap(null);
    }
    if (this.destinationMarker) {
      this.destinationMarker.setMap(null);
      this.destinationMarker = null;
    }
    this.markersMap = {};
  }

  browseByCoordinates() {
    if (!this.coordinates) {
      return;
    }

    console.log({ coordinates: this.coordinates });
    const useCoordinates = {
      northEast: this.coordinates.northEast,
      southWest: this.coordinates.southWest,
    }

    this.clearBrowseData();

    this.loading = true;
    this.deliveryService.browseMap(useCoordinates).subscribe({
      next: (response: ServiceMethodResultsInfo<IDelivery[]>) => {
        this.loading = false;
        console.log({ response });
        if (!response.data!.length) {
          this.alertService.showWarningMessage(`No results...`);
          return;
        }
        else {
          this.setBrowseData(response.data!);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.alertService.showErrorMessage(error.error.message);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onDeleteDelivery(delivery: IDelivery) {

  }

  assignDelivery(delivery: IDelivery) {
    const ask = window.confirm(`Are you sure you want to take this delivery?`);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.deliveryService.assignDelivery<any>(this.you!.id, delivery.id).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.alertService.handleResponseSuccessGeneric(response);
        this.router.navigate(['/', 'users', this.you!.id, 'delivering']);
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
