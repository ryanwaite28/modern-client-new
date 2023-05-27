import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { DeliveryService } from 'projects/modern/src/app/services/delivery.service';
import { of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

@Component({
  selector: 'deliverme-delivery-payment-success-page',
  templateUrl: './delivery-payment-success-page.component.html',
  styleUrls: ['./delivery-payment-success-page.component.scss']
})
export class DeliveryPaymentSuccessPageComponent implements OnInit {
  you: IUser | any;
  delivery: any = null;
  session_id: any = null;

  constructor(
    private userStore: UserStoreService,
    private userService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private deliveryService: DeliveryService
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe((you: IUser | null) => {
      this.you = you;
    });

    this.route.parent!.data
      .pipe(
        flatMap((data) => {
          this.delivery = data['delivery'];
          return this.route.parent!.queryParams;
        }),
        flatMap((params) => {
          this.session_id = params['session_id'];
          return of(true);
        })
      )
      .subscribe(() => {
        console.log(this);
      });
  }

}
