import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { genderOptions } from 'projects/common/src/app/_misc/vault';

@Component({
  selector: 'modern-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  loading: boolean = false;
  verification_requested_successfully: boolean = false;
  sms_request_id: string | any;
  phone_is_verified: boolean = false;

  TEXT_FORM_LIMIT = 250;
  COMMON_TEXT_VALIDATOR = [
    Validators.required,
    Validators.maxLength(this.TEXT_FORM_LIMIT)
  ];

  phoneForm = new UntypedFormGroup({
    phone: new UntypedFormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
  });
  phoneVerifyForm = new UntypedFormGroup({
    code: new UntypedFormControl('', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]),
  });

  genderOptions = genderOptions;
  signupForm = new UntypedFormGroup({
    firstname: new UntypedFormControl('', this.COMMON_TEXT_VALIDATOR),
    middlename: new UntypedFormControl('', Validators.maxLength(this.TEXT_FORM_LIMIT)),
    lastname: new UntypedFormControl('', this.COMMON_TEXT_VALIDATOR),
    username: new UntypedFormControl('', this.COMMON_TEXT_VALIDATOR),
    displayname: new UntypedFormControl('', this.COMMON_TEXT_VALIDATOR),

    email: new UntypedFormControl('', this.COMMON_TEXT_VALIDATOR),
    password: new UntypedFormControl('', this.COMMON_TEXT_VALIDATOR),
    confirmPassword: new UntypedFormControl('', this.COMMON_TEXT_VALIDATOR),
  });

  error = false;
  errorMessage: string | any;

  redirect: string = '';

  constructor(
    private userService: UsersService,
    private alertService: AlertService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe({
      next: (params: Params) => {
        console.log({ params });
        this.redirect = params['redirect'];
      }
    });
  }

  async send_sms_verification() {
    try {
      this.error = false;
      this.loading = true;
      const phone = this.phoneForm.value.phone;
      const user = await this.userService.get_user_by_phone(phone)
        .toPromise()
        .then((response) => {
          return response && response.data;
        })
        .catch((error: HttpErrorResponse) => {
          // console.log(error);
          this.alertService.handleResponseErrorGeneric(error);
          this.error = true;
          this.loading = false;
          this.errorMessage = `Could not send verification code; something went wrong...`;
          return;
        });
      if (user) {
        this.error = true;
        this.loading = false;
        this.errorMessage = `User already exists with that phone number; phone numbers must be unique...`;
        this.alertService.handleResponseErrorGeneric(new HttpErrorResponse({
          error: { message: this.errorMessage }
        }));
        return;
      }
    } catch (e) {
      this.error = true;
      this.loading = false;
      this.errorMessage = `Something went wrong...`;
      throw e;
    }

    this.userService.send_sms_verification(`1` + this.phoneForm.value.phone)
      .subscribe(
        (response: any) => {
          this.verification_requested_successfully = true;
          this.sms_request_id = response.sms_request_id;
        },
        (error: HttpErrorResponse) => {
          this.alertService.handleResponseErrorGeneric(error);
          this.error = true;
          this.errorMessage = error.error.message;
          this.loading = false;
        }
      );
  }

  verify_sms_code() {
    this.loading = true;
    this.userService.verify_sms_code({
      request_id: this.sms_request_id!,
      code: this.phoneVerifyForm.value.code
    }).subscribe(
      (response: any) => {
        this.phone_is_verified = true;
      },
      (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
        this.error = true;
        this.errorMessage = error.error.message;
        this.loading = false;
      }
    );
  }

  onSubmit() {
    if (!this.signupForm.valid) {
      // return;
    }
    this.error = false;
    this.loading = true;
    this.userService.sign_up({
      ...this.phoneForm.value,
      ...this.signupForm.value,
    }).subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric({ message: response.message! });
        if (this.redirect) {
          window.location.href = `${this.redirect}?jwt=${response.data.token}`;
          return;
        }
        this.router.navigate(['/', 'users', response.data.you.id]);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
        this.error = true;
        this.errorMessage = error.error.message;
        this.loading = false;
      }
    });
  }
}
