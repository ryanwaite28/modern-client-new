import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { getRouteParamKey } from 'projects/common/src/app/_misc/chamber';
import { map, Observable, of } from 'rxjs';
import { IMechanic } from '../interfaces/carmaster.interface';
import { CarmasterService } from '../services/carmaster.service';

@Injectable({
  providedIn: 'root'
})
export class MechanicProfileResolver implements Resolve<IMechanic | null> {
  constructor(
    private carmasterService: CarmasterService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IMechanic | null> {
    let user_id = getRouteParamKey(route.data['authParamsProp'], route, true);
    user_id && (user_id = parseInt(user_id, 10));
    console.log({ user_id });
    return (isNaN(user_id) || !user_id) ? of(null) : this.carmasterService.get_mechanic_by_user_id(user_id).pipe(
      map((response) => {
        return response.data || null;
      })
    )
  }
}
