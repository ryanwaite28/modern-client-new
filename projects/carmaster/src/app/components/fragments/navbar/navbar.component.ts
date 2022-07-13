import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { EnvironmentService } from 'projects/common/src/app/services/environment.service';
import { AppSocketEventsStateService } from 'projects/common/src/app/services/app-socket-events-state.service';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { combineLatest, filter, map, mergeMap, of, take } from 'rxjs';
import { MODERN_APPS } from 'projects/common/src/app/enums/all.enums';
import { CARMASTER_EVENT_TYPES } from '../../../enums/car-master.enum';
import { SocketEventsService } from 'projects/common/src/app/services/socket-events.service';
import { PlainObject } from 'projects/common/src/app/interfaces/json-object.interface';
import { CarmasterService } from '../../../services/carmaster.service';
import { IMechanic } from '../../../interfaces/carmaster.interface';



@Component({
  selector: 'carmaster-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  you: IUser | any;
  showMobileNav: boolean = false;
  eventsCounts: PlainObject<number> = {};
  mechanic_profile: IMechanic | null = null;
  links: any = [
    { text: `Sign In`, clickFn: (event: any) => { this.signin(); } },
  ];

  constructor(
    private socketEventsService: SocketEventsService,
    private appSocketEventsStateService: AppSocketEventsStateService,
    private carmasterService: CarmasterService,
    private usersService: UsersService,
    private userStore: UserStoreService,
    private router: Router,
    private envService: EnvironmentService,
  ) { }

  ngOnInit(): void {
    const eventsObs = this.socketEventsService.getServiceIsReady()
      .pipe(filter((state: boolean) => {
        return state;
      }))
      .pipe(take(1))
      .pipe(
        mergeMap((state: boolean) => {
          console.log(`NavbarComponent - listening:`);
          return combineLatest([
            this.appSocketEventsStateService.getAppEventStateChanges(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.NEW_CARMASTER_MESSAGE),
          ])
        })
      )
    .pipe(
      map((values) => {
        const eventsCounts: PlainObject<number> = {
          messages: values[0],
        };
        this.eventsCounts = eventsCounts;
        return eventsCounts;
      })
    );

    combineLatest([
      eventsObs,
      this.userStore.getChangesObs().pipe(
        mergeMap((you) => {
          this.you = you;
          return !you 
            ? of(null)
            : this.carmasterService.get_mechanic_by_user_id(you.id).pipe(
              map((response) => {
                this.mechanic_profile = response.data || null;
                return;
              })
            )
        })
      )
    ])
    .subscribe({
      next: (values) => {
        console.log(`NavbarComponent - values`, values);
        const you = this.you;
        const links = !!you
          ? [
              { text: `Home`, href: ['/', 'users', you.id, 'home'] },
              { text: `Mechanic`, href: ['/', 'users', you.id, 'mechanic'] },
              { text: `Messages`, href: ['/', 'users', you.id, 'messages'], badgeCount: this.eventsCounts['messages'] },
              { text: `Search`, href: ['/', 'search'] },
              { text: `Create Service Request`, href: ['/', 'create-service-request'] },
              { text: `Your Service Requests`, href: ['/', 'users', you.id, 'user-service-requests'] },
              { text: `Notifications`, href: ['/', 'users', you.id, 'notifications'] },
              // { text: `Settings`, href: ['/', 'users', you.id, 'settings'] },

              { text: `Sign Out`, clickFn: (event: any) => { this.signout(); } },
            ]
          : [
              { text: `Sign In`, clickFn: (event: any) => { this.signin(); } },
            ];
        
        // if (this.mechanic_profile) {
        //   links.splice(1, 0, { text: `Mechanic`, href: ['/', 'users', you.id, 'mechanic'] });
        // }
        this.links = links;
      }
    });
  }

  signin() {
    const redirect = `${this.envService.MODERN_DOMAIN}/signin?redirect=${window.location.href}`;
    window.location.href = redirect;
  }

  signout() {
    this.usersService.sign_out();
    this.router.navigate(['/']);
  }
}
