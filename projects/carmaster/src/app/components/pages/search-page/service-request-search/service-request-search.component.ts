import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlainObject } from 'projects/common/src/app/interfaces/json-object.interface';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { IFormSubmitEvent } from 'projects/common/src/app/interfaces/_common.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { finalize } from 'rxjs';
import { IMechanicServiceRequest } from '../../../../interfaces/carmaster.interface';
import { CarmasterService } from '../../../../services/carmaster.service';

@Component({
  selector: 'carmaster-service-request-search',
  templateUrl: './service-request-search.component.html',
  styleUrls: ['./service-request-search.component.scss']
})
export class ServiceRequestSearchComponent implements OnInit {
  you: IUser | null = null;
  loading = false;
  service_requests: IMechanicServiceRequest[] = [];

  MSG_MAX_LENGTH = 1000;
  messageFormsByUserId: PlainObject<FormGroup> = {};

  constructor(
    private userStore: UserStoreService,
    private carmasterService: CarmasterService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe({
      next: (you) => {
        this.you = you;
      }
    });
  }

  searchServiceRequests($event: IFormSubmitEvent) {
    this.loading = true;
    this.carmasterService.search_service_requests($event.payload)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.service_requests = response.data!;
        if (!this.service_requests.length) {
          this.alertService.showWarningMessage(`No results...`);
          return;
        }

        this.messageFormsByUserId = {};
        for (const service_request of this.service_requests) {
          this.messageFormsByUserId[service_request.user_id] = new FormGroup({
            sendText: new FormControl(false, []),
            body: new FormControl('', [
              Validators.required,
              Validators.minLength(1),
              Validators.maxLength(this.MSG_MAX_LENGTH)
            ])
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  sendMessageToUser(user: IUser) {
    const formGroup = this.messageFormsByUserId[user.id];
    console.log({ formGroup, user });
    this.carmasterService.send_user_message(this.you!.id, user.id, {
      ...formGroup.value,
      user
    }).subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        formGroup.get('body')?.setValue('');
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }
}
