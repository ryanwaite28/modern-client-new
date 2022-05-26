import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { IFormSubmitEvent } from 'projects/common/src/app/interfaces/_common.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { finalize } from 'rxjs';
import { IMechanic, IMechanicCredential } from '../../../interfaces/carmaster.interface';
import { CarmasterService } from '../../../services/carmaster.service';

@Component({
  selector: 'carmaster-mechanic-credential',
  templateUrl: './mechanic-credential.component.html',
  styleUrls: ['./mechanic-credential.component.scss']
})
export class MechanicCredentialComponent implements OnInit {
  @Input() mechanic_profile!: IMechanic;
  @Input() credential!: IMechanicCredential;
  @Output() onDelete = new EventEmitter();
  
  you: IUser | null = null;
  isEditing = false;
  loading = false;

  get credentialWebsite(): string {
    const link = !this.credential.website.startsWith(`https://`) || !this.credential.website.startsWith(`http://`)
      ? `http://${this.credential.website}`
      : this.credential.website;

    return link;
  }

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

  updateCredential($event: IFormSubmitEvent) {
    if (!$event) {
      return;
    }
  
    this.loading = true;
    this.carmasterService.update_mechanic_credential(this.credential.mechanic_id, this.credential.id, $event.formData)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        Object.assign(this.credential, response.data![1]);
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
