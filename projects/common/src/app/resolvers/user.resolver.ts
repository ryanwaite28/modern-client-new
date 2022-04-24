import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { map } from "rxjs/operators";
import { ResolveType } from "../guards/_guard";
import { GetSessionResponse } from "../interfaces/responses.interface";
import { IUser } from "../interfaces/user.interface";
import { UsersService } from "../services/users.service";
import { UserStoreService } from "../stores/user-store.service";

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<IUser | null> {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private userStore: UserStoreService,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): ResolveType<IUser | null> {
    // console.log({ state, route });
    return this.usersService.get_user_by_id(route.params['user_id']).pipe(
      map((response) => {
        return response.data || null;
      })
    )
  }
}