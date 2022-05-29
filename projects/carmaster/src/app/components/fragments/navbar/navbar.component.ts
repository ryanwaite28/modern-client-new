import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { EnvironmentService } from 'projects/common/src/app/services/environment.service';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';



@Component({
  selector: 'carmaster-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  you: IUser | any;
  showMobileNav: boolean = false;

  links: any;

  constructor(
    private usersService: UsersService,
    private userStore: UserStoreService,
    private router: Router,
    private envService: EnvironmentService,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe({
      next: (you) => {
        this.you = you;
        console.log({ you });
        
        this.links = !!you
          ? [
              { text: `Home`, href: ['/', 'users', you.id, 'home'] },
              { text: `Mechanic Profile`, href: ['/', 'users', you.id, 'mechanic-profile'] },
              { text: `Search`, href: ['/', 'mechanic-search'] },
              { text: `Create Service Request`, href: ['/', 'create-service-request'] },
              // { text: `Settings`, href: ['/', 'users', you.id, 'settings'] },

              { text: `Sign Out`, clickFn: (event: any) => { this.signout(); } },
            ]
          : [
              { text: `Sign In`, clickFn: (event: any) => { this.signin(); } },
            ];
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
