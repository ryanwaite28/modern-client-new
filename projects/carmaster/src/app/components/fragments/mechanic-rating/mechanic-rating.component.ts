import { Component, Input, OnInit } from '@angular/core';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
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
}
