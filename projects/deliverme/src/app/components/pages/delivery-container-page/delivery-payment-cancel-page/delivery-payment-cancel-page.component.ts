import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { DeliveryService } from 'projects/deliverme/src/app/services/delivery.service';


@Component({
  selector: 'deliverme-delivery-payment-cancel-page',
  templateUrl: './delivery-payment-cancel-page.component.html',
  styleUrls: ['./delivery-payment-cancel-page.component.scss']
})
export class DeliveryPaymentCancelPageComponent implements OnInit {
  you: IUser | any;
  delivery: any = null;

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
    
    this.route.data.subscribe((data) => {
      this.delivery = data['delivery'];
      console.log(this);
    });
  }

}
