import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../../../services/alert.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'common-password-reset-page',
  templateUrl: './password-reset-page.component.html',
  styleUrls: ['./password-reset-page.component.scss']
})
export class PasswordResetPageComponent implements OnInit {
  sendResetForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
  });

  confirmCodeForm = new FormGroup({
    code: new FormControl('', [Validators.required]),
  });

  loading: boolean = false;

  constructor(
    private usersService: UsersService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
  }

  onSendSubmit() {
    if (this.sendResetForm.invalid) {
      return;
    }
    this.loading = true;
    this.usersService.submit_reset_password_request(this.sendResetForm.value.email)
      .subscribe(
        (response) => {
          console.log(response);
          this.loading = false;
          this.alertService.handleResponseSuccessGeneric(response);
          this.sendResetForm.reset();
          this.sendResetForm.markAsPristine();
        },
        (error: HttpErrorResponse) => {
          this.loading = false;
          this.alertService.handleResponseErrorGeneric(error);
        },
      );
  }

  onConfirmSubmit() {
    if (this.confirmCodeForm.invalid) {
      return;
    }
    this.loading = true;
    this.usersService.submit_password_reset_code(this.confirmCodeForm.value.code)
      .subscribe(
        (response) => {
          this.loading = false;
          console.log(response);
          this.alertService.handleResponseSuccessGeneric(response);
          this.confirmCodeForm.reset();
          this.confirmCodeForm.markAsPristine();
        },
        (error: HttpErrorResponse) => {
          this.loading = false;
          this.alertService.handleResponseErrorGeneric(error);
        },
      );
  }
}
