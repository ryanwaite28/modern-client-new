import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ActivatedRoute
} from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { ResolveType } from '../guards/_guard';
import { IUser } from '../interfaces/user.interface';
import { IUserSubscriptionInfo } from '../interfaces/_common.interface';
import { UsersService } from '../services/users.service';
import { UserStoreService } from '../stores/user-store.service';

@Injectable({
  providedIn: 'root'
})
export class UserSubscriptionInfoResolver implements Resolve<IUserSubscriptionInfo | null> {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private userStore: UserStoreService,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): ResolveType<IUserSubscriptionInfo | null> {
    // console.log({ state, route });
    return this.usersService.get_platform_subscription_info(route.params['user_id']).pipe(
      map((response) => {
        return response.data!;
      })
    )
  }
}