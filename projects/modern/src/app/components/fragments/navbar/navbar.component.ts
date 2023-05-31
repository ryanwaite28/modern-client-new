import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';



@Component({
  selector: 'modern-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  you: IUser | any;
  showMobileNav: boolean = false;

  links: any;

  constructor(
    private userStore: UserStoreService,
    private router: Router,
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
              { text: `Search Form`, href: ['/', 'users', you.id, 'search'] },
              { text: `Search Map`, href: ['/', 'deliveries', 'browse-map'] },
              { text: `Recent`, href: ['/', 'deliveries', 'browse-recent'] },
              { text: `Sign Out`, href: ['/', 'signout'] },
            ]
          : [
              { text: `Sign In`, href: ['/', 'signin'] },
              { text: `Sign Up`, href: ['/', 'signup'] },
            ];
      }
    });
  }

}
