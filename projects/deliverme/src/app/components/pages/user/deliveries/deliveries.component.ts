import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { GoogleMapsService } from 'projects/common/src/app/services/google-maps.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { DeliveryService } from 'projects/deliverme/src/app/services/delivery.service';

@Component({
  selector: 'deliverme-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliverMeUserDeliveriesFragmentComponent implements AfterViewInit, OnDestroy {
  you: IUser | any;
  deliveries: any[] = [];
  end_reached: boolean = true;
  loading: boolean = false;

  constructor(
    private userStore: UserStoreService,
    private alertService: AlertService,
    private deliveryService: DeliveryService,
    private googleMapsService: GoogleMapsService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngAfterViewInit(): void {
    this.userStore.getChangesObs().subscribe((you: IUser | null) => {
      this.you = you;
      if (you) {
        this.getDeliveries();
      }
    });
  }

  ngOnDestroy() {
  }

  getDeliveries() {
    const min_id =
      this.deliveries.length &&
      this.deliveries[this.deliveries.length - 1].id;

    this.loading = true;
    this.deliveryService.getUserDeliveries(this.you!.id, min_id).subscribe({
      next: (response: any) => {
        for (const delivery of response.data) {
          this.deliveries.push(delivery);
        }
        this.end_reached = response.data.length < 5;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  onDeleteDelivery(delivery: any) {
    this.loading = true;
    this.deliveryService.delete_delivery(delivery.id).subscribe({
      next: (response: any) => {
        this.alertService.handleResponseSuccessGeneric(response);
        const index = this.deliveries.indexOf(delivery);
        this.deliveries.splice(index, 1);
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }
}
