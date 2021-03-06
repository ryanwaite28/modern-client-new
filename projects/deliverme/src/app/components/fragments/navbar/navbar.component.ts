import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { EnvironmentService } from 'projects/common/src/app/services/environment.service';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';



@Component({
  selector: 'deliverme-navbar',
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
              { text: `Home`, href: ['/', 'users', you.id] },
              { text: `Settings`, href: ['/', 'users', you.id, 'settings'] },
              { text: `Create Delivery`, href: ['/', 'users', you.id, 'create-delivery'] },
              { text: `Deliveries`, href: ['/', 'users', you.id, 'deliveries'] },
              { text: `Delivering`, href: ['/', 'users', you.id, 'delivering'] },
              { text: `Search`, href: ['/', 'users', you.id, 'search'] },
              { text: `Recent`, href: ['/', 'deliveries', 'browse-recent'] },
              { text: `Map`, href: ['/', 'deliveries', 'browse-map'] },

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
