import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { DeliveryService } from 'projects/deliverme/src/app/services/delivery.service';

@Component({
  selector: 'deliverme-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class DeliverMeUserHomeComponent implements OnInit {
  you: IUser | any;
  user: IUser | null = null;
  stats: any;

  constructor(
    private userStore: UserStoreService,
    private deliveryService: DeliveryService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    console.log(this);
    this.userStore.getChangesObs().subscribe({
      next: (you: IUser | null) => {
        this.you = you;
      }
    });

    this.route.parent!.data.subscribe((data) => {
      this.user = data['user'];
      if (this.user) {
        this.deliveryService.getUserStats(this.user.id).subscribe({
          next: (response) => {
            console.log(response, this);
            this.stats = response.data;
          }
        });
      }
    });
  }

}
