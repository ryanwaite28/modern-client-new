import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { GoogleMapsService } from 'projects/common/src/app/services/google-maps.service';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { DeliveryService } from 'projects/modern/src/app/services/delivery.service';


@Component({
  selector: 'deliverme-create-delivery',
  templateUrl: './create-delivery.component.html',
  styleUrls: ['./create-delivery.component.scss']
})
export class DeliverMeUserCreateDeliveryFragmentComponent implements OnInit, OnDestroy {
  you: any;
  loading: boolean = false;
  is_subscription_active: boolean = false;

  constructor(
    private userStore: UserStoreService,
    private usersService: UsersService,
    private alertService: AlertService,
    private deliveryService: DeliveryService,
    private googleMapsService: GoogleMapsService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe((you: IUser | null) => {
      this.you = you;
      this.is_subscription_active = this.usersService.getHasPlatformSubscription();
    });
  }

  ngOnDestroy() {
  }

  onSubmitNewDelivery(params: any) {
    const msg =
      `Are all input values correct? It cannot be updated/edited later.`;
    const ask = window.confirm(msg);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.deliveryService.create_delivery(params.formData).subscribe({
      next: (response: any) => {
        this.alertService.handleResponseSuccessGeneric(response);
        params.resetForm && params.resetForm();
        this.loading = false;
      },
      error: (error: any) => {
        this.alertService.handleResponseErrorGeneric(error);
        this.loading = false;
      },
    });
  }
}
