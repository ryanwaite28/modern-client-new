import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { finalize } from 'rxjs';
import { IMechanic, IMechanicRating } from '../../../interfaces/carmaster.interface';
import { CarmasterService } from '../../../services/carmaster.service';

@Component({
  selector: 'carmaster-mechanic-rating',
  templateUrl: './mechanic-rating.component.html',
  styleUrls: ['./mechanic-rating.component.scss']
})
export class MechanicRatingComponent implements OnInit {
  @Input() rating!: IMechanicRating;
  @Input() mechanic_profile!: IMechanic;

  you: IUser | null = null;
  loading = false;
  summaryControl = new UntypedFormControl('', [Validators.required]);

  get isYou(): boolean {
    const isYours = (
      this.you && 
      this.mechanic_profile &&
      this.mechanic_profile.user_id === this.you.id
    );
    return !!isYours;
  };

  get isRatingOwner(): boolean {
    const isYours = (
      this.you && 
      this.rating &&
      this.rating.writer_id === this.you.id
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

  onSubmitEdit() {
    if (this.summaryControl.invalid) {
      return;
    }

    this.loading = true;
    const data: any = {
      summary: this.summaryControl.value
    };
    this.carmasterService.create_mechanic_rating_edit(this.rating!.mechanic_id, this.rating!.id, data)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.rating!.mechanic_rating_edits!.unshift(response.data!);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }
}
