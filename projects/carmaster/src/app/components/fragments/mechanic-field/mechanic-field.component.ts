import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { IFormSubmitEvent } from 'projects/common/src/app/interfaces/_common.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { finalize } from 'rxjs';
import { IMechanic, IMechanicField } from '../../../interfaces/carmaster.interface';
import { CarmasterService } from '../../../services/carmaster.service';

@Component({
  selector: 'carmaster-mechanic-field',
  templateUrl: './mechanic-field.component.html',
  styleUrls: ['./mechanic-field.component.scss']
})
export class MechanicFieldComponent implements OnInit {
  @Input() mechanic_profile!: IMechanic;
  @Input() field!: IMechanicField;
  @Output() onDelete = new EventEmitter();
  
  you: IUser | null = null;
  isEditing = false;
  loading = false;

  get isYou(): boolean {
    const isYours = (
      this.you && 
      this.mechanic_profile &&
      this.mechanic_profile.user_id === this.you.id
    );
    return !!isYours;
  };

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

  updateField($event: IFormSubmitEvent) {
    if (!$event) {
      return;
    }
  
    this.loading = true;
    this.carmasterService.update_mechanic_field(this.field.mechanic_id, this.field.id, $event.payload)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        Object.assign(this.field, response.data![1]);
        this.isEditing = false;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  emitDelete() {
    this.onDelete.emit();
  }
}
