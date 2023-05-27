import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { ServiceMethodResultsInfo } from 'projects/common/src/app/interfaces/_common.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { GoogleMapsService } from 'projects/common/src/app/services/google-maps.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { DeliveryCardDisplayMode } from '../../../enums/deliverme.enum';
import { IDelivery } from '../../../interfaces/deliverme.interface';
import { DeliveryService } from '../../../services/delivery.service';

@Component({
  selector: 'deliverme-delivery-browse-recent',
  templateUrl: './delivery-browse-recent.component.html',
  styleUrls: ['./delivery-browse-recent.component.scss']
})
export class DeliverMeDeliveryBrowseRecentPageComponent implements OnInit {
  you: IUser | any;
  deliveries: IDelivery[] = [];
  end_reached: boolean = true;
  loading: boolean = false;
  DeliveryCardDisplayMode = DeliveryCardDisplayMode;

  constructor(
    private userStore: UserStoreService,
    private alertService: AlertService,
    private deliveryService: DeliveryService,
    private googleMapsService: GoogleMapsService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
  ) { }

  ngOnInit(): void {
    console.log(this);
    this.userStore.getChangesObs().subscribe({
      next: (you: IUser | null) => {
        this.you = you;
        this.getDeliveries();
      }
    });
  }

  getDeliveries() {
    const min_id =
      this.deliveries.length &&
      this.deliveries[this.deliveries.length - 1].id;

    this.loading = true;
    this.deliveryService.browseRecent(min_id).subscribe({
      next: (response: ServiceMethodResultsInfo<IDelivery[]>) => {
        for (const delivery of response.data!) {
          this.deliveries.push(delivery);
        }
        this.end_reached = response.data!.length < 5;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
    });
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
