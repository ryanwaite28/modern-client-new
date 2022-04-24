import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { map } from 'rxjs/operators';
import { getRouteParamKey } from '../_misc/chamber';
import { CanActivateReturn } from './_guard';
import { IUser } from '../interfaces/user.interface';
import { UsersService } from '../services/users.service';
import { UserStoreService } from '../stores/user-store.service';


@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private usersService: UsersService,
    private router: Router,
    private userStore: UserStoreService,
  ) {}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): CanActivateReturn {
    const canActivate = this.canActivate(route, state);
    return canActivate;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): CanActivateReturn {
    return this.usersService.checkUserSession().pipe(
      map((you) => {
        const canActivate = this.handleCanActivate(you, route);
        if (!canActivate) {
          this.router.navigate(['/']);
        }
        return canActivate;
      })
    );
  }

  handleCanActivate(you: IUser | null, route: ActivatedRouteSnapshot) {
    const checkAuth = this.checkAuth(you, route);
    if (checkAuth) {
      return true;
    } else {
      const errorMessage =
        route.data['canActivateErrorMessage'] ||
        'You do not have permission to access this page.';
      return false;
    }
  }

  checkAuth(you: IUser | null, route: ActivatedRouteSnapshot): boolean {
    if (!you) { return false; }
    const id = getRouteParamKey(route.data['authParamsProp'], route, true);
    const userId = parseInt(id, 10);
    const youAreUser = userId === you.id;
    return youAreUser;
  }
}
