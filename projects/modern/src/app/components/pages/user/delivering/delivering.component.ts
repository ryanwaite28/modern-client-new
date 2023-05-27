import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { INavigatorGeoLocation } from 'projects/common/src/app/interfaces/_common.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { GoogleMapsService } from 'projects/common/src/app/services/google-maps.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { DeliveryCardDisplayMode } from 'projects/modern/src/app/enums/deliverme.enum';
import { DeliveryService } from 'projects/modern/src/app/services/delivery.service';
import { flatMap, mergeMap } from 'rxjs/operators';

const searchCriterias = [
  { label: 'From City', value: 'from-city' },
  { label: 'To City', value: 'to-city' },

  { label: 'From State', value: 'from-state' },
  { label: 'To State', value: 'to-state' },

  { label: 'From City in State', value: 'from-city-state' },
  { label: 'To City in State', value: 'to-city-state' },

  // { label: 'County in State', value: 'county-state' },
];

@Component({
  selector: 'deliverme-delivering',
  templateUrl: './delivering.component.html',
  styleUrls: ['./delivering.component.scss']
})
export class DeliverMeUserDeliveringFragmentComponent implements OnInit, OnDestroy {
  you: any;
  current_deliverings: any[] = [];
  potential_delivering: any;
  DeliveryCardDisplayMode = DeliveryCardDisplayMode;

  past_deliverings: any[] = [];
  end_reached_past: boolean = true;
  loading: boolean = false;

  searchCriteriaCtrl = new UntypedFormControl(searchCriterias[2].value, []);
  searchCriterias = searchCriterias;

  constructor(
    private userStore: UserStoreService,
    private alertService: AlertService,
    private deliveryService: DeliveryService,
    private googleMapsService: GoogleMapsService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe((you: IUser | null) => {
      this.you = you;
      if (you) {
        this.getCurrentDelivering();
        this.getDeliverings();
      }
    });
  }

  ngOnDestroy() {
  }

  removeCurrentDelivery(delivery: any) {
    const index = this.current_deliverings.findIndex((d) => d.id === delivery.id);
    if (index > -1) {
      this.current_deliverings.splice(index, 1);
    }
  }

  onCurrentDeliveryCompleted(delivery: any) {
    this.removeCurrentDelivery(delivery);
    this.past_deliverings.unshift(delivery);
  }

  onCurrentDeliveryReturned(delivery: any) {
    this.removeCurrentDelivery(delivery);
  }

  getCurrentDelivering() {
    this.deliveryService.getUserDelivering(this.you!.id).subscribe({
      next: (response: any) => {
        this.current_deliverings = response.data;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  getDeliverings() {
    const min_id =
      this.past_deliverings.length &&
      this.past_deliverings[this.past_deliverings.length - 1].id;

    this.loading = true;
    this.deliveryService.getUserPastDeliverings(this.you!.id, min_id).subscribe({
      next: (response: any) => {
        for (const delivery of response.data) {
          this.past_deliverings.push(delivery);
        }
        this.end_reached_past = response.data.length < 5;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  findDelivery() {
    this.loading = true;
    this.googleMapsService.getCurrentLocation()
      .pipe(mergeMap((position: INavigatorGeoLocation, index: number) => {
        return this.googleMapsService.getLocationViaCoordinates(
          position.lat,
          position.lng,
        );
      }))
      .pipe(flatMap((data: any, index: number) => {
        const criteria = this.searchCriteriaCtrl.value;
        const postData: any = {
          criteria
        };

        switch (criteria) {
          case searchCriterias[0].value:
          case searchCriterias[1].value: {
            // city
            postData.city = data.placeData.city;
            break;
          }
          case searchCriterias[2].value: 
          case searchCriterias[3].value: {
            // state
            postData.state = data.placeData.state;
            break;
          }
          case searchCriterias[4].value: 
          case searchCriterias[5].value: {
            // city-state
            postData.city = data.placeData.city;
            postData.state = data.placeData.state;
            break;
          }
        }

        return this.deliveryService.findAvailableDelivery<any>(postData);
      }))
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.potential_delivering = response.data;
          this.loading = false;
        },
        error: (error: any) => {
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
    this.deliveryService.assignDelivery<any>(this.you!.id, this.potential_delivering.id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.alertService.handleResponseSuccessGeneric(response);
        this.current_deliverings.unshift(response.data.delivery);
        this.potential_delivering = undefined;
        this.loading = false;
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

  unassignDelivery(delivery: any) {
    const ask = window.confirm(`Are you sure you want to cancel this delivery?`);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.deliveryService.unassignDelivery<any>(this.you!.id, delivery.id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.alertService.handleResponseSuccessGeneric(response);
        this.removeCurrentDelivery(delivery);
        this.loading = false;
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

  markDeliveryAsPickedUp(delivery: any) {
    const ask = window.confirm(`Have you picked up this delivery?`);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.deliveryService.markDeliveryAsPickedUp<any>(this.you!.id, delivery.id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.alertService.handleResponseSuccessGeneric(response);
        Object.assign(delivery, response.data.delivery);
        this.loading = false;
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

  markDeliveryAsDroppedOff(delivery: any) {
    const ask = window.confirm(`Have you dropped off this delivery?`);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.deliveryService.markDeliveryAsDroppedOff<any>(this.you!.id, delivery.id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.alertService.handleResponseSuccessGeneric(response);
        Object.assign(delivery, response.data.delivery);
        this.loading = false;
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

  markDeliveryAsReturned(delivery: any) {
    const ask = window.confirm(`Have you returned this delivery?`);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.deliveryService.markDeliveryAsReturned<any>(this.you!.id, delivery.id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.alertService.handleResponseSuccessGeneric(response);
        this.removeCurrentDelivery(delivery);
        this.loading = false;
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