import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { UsersService } from 'projects/common/src/app/services/users.service';

@Component({
  selector: 'common-password-reset-page',
  templateUrl: './password-reset-page.component.html',
  styleUrls: ['./password-reset-page.component.scss']
})
export class PasswordResetPageComponent implements OnInit {
  emailInput: string = '';
  verificationCodeInput: string = '';

  loading: boolean = false;

  constructor(
    private usersService: UsersService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
  }

  onSubmitEmail() {
    if (!this.emailInput) {
      return;
    }
    this.loading = true;
    this.usersService.submit_reset_password_request(this.emailInput)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.loading = false;
          this.alertService.handleResponseSuccessGeneric(response);
          this.emailInput = "";
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.alertService.handleResponseErrorGeneric(error);
        },
      });
  }
}
