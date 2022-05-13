import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { CarmasterService } from '../services/carmaster.service';

@Injectable({
  providedIn: 'root'
})
export class MechanicProfileResolver implements Resolve<boolean> {
  constructor(
    private carmasterService: CarmasterService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.carmasterService.get_mechanic_by_user_id(route.params['user_id']).pipe(
      map((response) => {
        return response.data || null;
      })
    )
  }
}
