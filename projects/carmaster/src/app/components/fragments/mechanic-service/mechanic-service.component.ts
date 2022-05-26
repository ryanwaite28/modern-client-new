import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { IFormSubmitEvent } from 'projects/common/src/app/interfaces/_common.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { finalize } from 'rxjs';
import { IMechanic, IMechanicService } from '../../../interfaces/carmaster.interface';
import { CarmasterService } from '../../../services/carmaster.service';
import { service_categories_display_by_key } from '../../../utils/car-services.chamber';

@Component({
  selector: 'carmaster-mechanic-service',
  templateUrl: './mechanic-service.component.html',
  styleUrls: ['./mechanic-service.component.scss']
})
export class MechanicServiceComponent implements OnInit {
  @Input() mechanic_profile!: IMechanic;
  @Input() service!: IMechanicService;
  @Output() onDelete = new EventEmitter();
  
  service_categories_display_by_key = service_categories_display_by_key;
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

  updateService($event: IFormSubmitEvent) {
    if (!$event) {
      return;
    }
  
    this.loading = true;
    this.carmasterService.update_mechanic_service(this.service.mechanic_id, this.service.id, $event.payload)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        Object.assign(this.service, response.data![1]);
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