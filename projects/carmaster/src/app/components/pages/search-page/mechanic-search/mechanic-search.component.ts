import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { PlainObject } from 'projects/common/src/app/interfaces/json-object.interface';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { IFormSubmitEvent } from 'projects/common/src/app/interfaces/_common.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { finalize } from 'rxjs';
import { IMechanic } from '../../../../interfaces/carmaster.interface';
import { CarmasterService } from '../../../../services/carmaster.service';

@Component({
  selector: 'carmaster-mechanic-search',
  templateUrl: './mechanic-search.component.html',
  styleUrls: ['./mechanic-search.component.scss']
})
export class MechanicSearchComponent implements OnInit {
  you: IUser | null = null;
  loading = false;
  mechanics: IMechanic[] = [];

  MSG_MAX_LENGTH = 1000;
  messageFormsByMechanicId: PlainObject<UntypedFormGroup> = {};

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

  searchMechanics($event: IFormSubmitEvent) {
    this.loading = true;
    this.carmasterService.search_mechanics($event.payload)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.mechanics = response.data!;
        if (!this.mechanics.length) {
          this.alertService.showWarningMessage(`No results...`);
          return;
        }

        this.messageFormsByMechanicId = {};
        for (const mechanic of this.mechanics) {
          this.messageFormsByMechanicId[mechanic.id] = new UntypedFormGroup({
            sendText: new UntypedFormControl(false, []),
            body: new UntypedFormControl('', [
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

  sendMessageToMechanic(mechanic: IMechanic) {
    const formGroup = this.messageFormsByMechanicId[mechanic.id];
    console.log({ formGroup, mechanic });
    this.carmasterService.send_user_message(this.you!.id, mechanic.user_id, {
      ...formGroup.value,
      mechanic
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
