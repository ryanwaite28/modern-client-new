import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { map, mergeMap, Observable, of } from 'rxjs';
import { CarmasterService } from '../services/carmaster.service';

@Injectable({
  providedIn: 'root'
})
export class IsMechanicGuard implements CanActivate {
  constructor(
    private userStore: UserStoreService,
    private usersService: UsersService,
    private carmasterService: CarmasterService,
    private router: Router,
    private alertService: AlertService,
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.userStore.getChangesObs()
      .pipe(
        mergeMap((you: IUser | null) => {
          if (!you) {
            return of(false);
          }
          return this.carmasterService.get_mechanic_by_user_id(you.id)
            .pipe(
              map((response) => {
                const isMechanic = !!response.data;
                console.log({ isMechanic });
                if (!isMechanic) {
                  this.alertService.showSuccessMessage(`Mechanic restricted. You can become a mechanic by creating a mechanic profile.`);
                }
                return isMechanic;
              })
            );
        }),
      )
  }
}
