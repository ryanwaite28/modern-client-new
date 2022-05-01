import { Component, OnInit } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { IUserField } from 'projects/common/src/app/interfaces/user-field.interface';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';

@Component({
  selector: 'deliverme-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class DeliverMeUserPageComponent implements OnInit {
  you: IUser | any;
  user: IUser | any;
  user_fields: IUserField[] = [];

  get isYou(): boolean {
    const isYours = (
      this.you && 
      this.user &&
      this.user.id === this.you.id
    );
    return !!isYours;
  };

  constructor(
    private userStore: UserStoreService,
    private userService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.userStore.getChangesObs().subscribe((you: IUser | null) => {
      this.you = you;
    });

    this.route.data.subscribe((data) => {
      this.user = data['user'];
    });
  }
}
