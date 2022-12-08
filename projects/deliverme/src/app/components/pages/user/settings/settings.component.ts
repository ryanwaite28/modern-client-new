import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { GoogleMapsService } from 'projects/common/src/app/services/google-maps.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { DeliveryService } from 'projects/deliverme/src/app/services/delivery.service';


@Component({
  selector: 'deliverme-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class DeliverMeUserSettingsFragmentComponent implements OnInit, OnDestroy {
  you: IUser | any;
  loading = false;

  delivermeSettingsForm = new UntypedFormGroup({
    phone: new UntypedFormControl('', [Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]{10,11}$/g)]),
    email: new UntypedFormControl('', []),

    cashapp_tag: new UntypedFormControl('', []),
    venmo_id: new UntypedFormControl('', []),
    paypal_me: new UntypedFormControl('', []),
    google_pay: new UntypedFormControl('', []),
  });

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
        this.deliveryService.getUserDelivermeSettings(you.id).subscribe({
          next: (response: any) => {
            this.delivermeSettingsForm.setValue({
              phone: response.data.phone,
              email: response.data.email,

              cashapp_tag: response.data.cashapp_tag,
              venmo_id: response.data.venmo_id,
              paypal_me: response.data.paypal_me,
              google_pay: response.data.google_pay,
            });
          },
          error: (error: any) => {
            
          },
          complete: () => {
            
          },
        });
      }
    });
  }

  ngOnDestroy() {
  }

  onSubmitUserDelivermeSettingsForm() {
    this.loading = true;
    this.deliveryService.updateUserDelivermeSettings(this.you!.id, this.delivermeSettingsForm.value).subscribe({
      next: (response: any) => {
        this.loading = true;
        this.alertService.handleResponseSuccessGeneric(response);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = true;
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = true;
      },
    });
  }
}
