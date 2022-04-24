import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { map } from 'rxjs/operators';
import { CanActivateReturn } from './_guard';
import { UsersService } from '../services/users.service';



@Injectable({
  providedIn: 'root'
})
export class SignedInGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private router: Router,
  ) {}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): CanActivateReturn {
    return this.canActivate(route, state);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): CanActivateReturn {
    return this.usersService.checkUserSession().pipe(
      map((you) => {
        if (!you) {
          this.router.navigate(['/', 'modern', 'signin']);
        }
        return !!you;
      })
    );
  }
}
