import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { UsersService } from 'projects/common/src/app/services/users.service';

@Component({
  selector: 'modern-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.scss']
})
export class SignoutComponent implements OnInit {

  constructor(
    private usersService: UsersService,
    private router: Router,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.usersService.sign_out();
    this.router.navigate(['/', 'signin']);
    this.alertService.handleResponseSuccessGeneric({ message: `Signed out successfully!` });
  }

}
