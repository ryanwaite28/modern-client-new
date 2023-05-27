import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IUserField } from 'projects/common/src/app/interfaces/user-field.interface';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { DeliveryService } from 'projects/modern/src/app/services/delivery.service';

@Component({
  selector: 'common-user-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class UserHomeFragmentComponent implements OnInit {
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
