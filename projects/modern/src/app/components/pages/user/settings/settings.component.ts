import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PaymentMethod, StripeCardElement, PaymentMethodResult } from '@stripe/stripe-js';
import { AlertDivClass } from 'projects/common/src/app/enums/all.enums';
import { PlainObject } from 'projects/common/src/app/interfaces/json-object.interface';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { IApiKey, ServiceMethodResultsInfo } from 'projects/common/src/app/interfaces/_common.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { ClientService } from 'projects/common/src/app/services/client.service';
import { GoogleMapsService } from 'projects/common/src/app/services/google-maps.service';
import { StripeService } from 'projects/common/src/app/services/stripe.service';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { capitalize, getUserFullName } from 'projects/common/src/app/_misc/chamber';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'common-user-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class UserSettingsFragmentComponent implements OnInit, AfterViewInit, OnDestroy {
  you: IUser | null = null;
  now: number = Date.now();
  loading: boolean = false;
  initState = false;
  infoData: PlainObject = {};
  locationInfo: PlainObject = {};
  loadingPath = '';
  apiKey: IApiKey | undefined;
  payment_methods: PaymentMethod[] = [];
  cityQuery?: string;
  zipcodeQuery?: string;
  placeData: PlainObject = {};

  verification_requested_successfully: boolean = false;
  sms_request_id?: string;
  sms_results: any;
  phone_is_verified: boolean = false;
  is_subscription_active: boolean = false;
  platform_subscription: any;
  
  // forms

  TEXT_FORM_LIMIT = 250;
  COMMON_TEXT_VALIDATOR = [
    Validators.required,
    Validators.maxLength(this.TEXT_FORM_LIMIT)
  ];

  TEXT_INV_PRT_LIMIT = 500;

  userInfoForm = new UntypedFormGroup({
    email: new UntypedFormControl('', this.COMMON_TEXT_VALIDATOR),
    // phone: new UntypedFormControl('', [Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]{10,11}$/g)]),
    username: new UntypedFormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    displayname: new UntypedFormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    // city: new UntypedFormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    // state: new UntypedFormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    // zipcode: new UntypedFormControl(0, [Validators.maxLength(5)]),
    // country: new UntypedFormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    location: new UntypedFormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    location_id: new UntypedFormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    location_json: new UntypedFormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    bio: new UntypedFormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    headline: new UntypedFormControl('', [Validators.maxLength(75)]),
    // tags: new UntypedFormControl([], [Validators.maxLength(20)]),
    can_message: new UntypedFormControl(false, []),
    can_converse: new UntypedFormControl(false, []),
  });

  userPasswordForm = new UntypedFormGroup({
    oldPassword: new UntypedFormControl('', this.COMMON_TEXT_VALIDATOR),
    password: new UntypedFormControl('', this.COMMON_TEXT_VALIDATOR),
    confirmPassword: new UntypedFormControl('', this.COMMON_TEXT_VALIDATOR),
  });

  phoneForm = new UntypedFormGroup({
    phone: new UntypedFormControl('', [Validators.pattern(/^[\d]+$/), Validators.minLength(10), Validators.maxLength(10)]),
  });
  phoneVerifyForm = new UntypedFormGroup({
    code: new UntypedFormControl('', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]),
  });

  userIconForm = new UntypedFormGroup({
    file: new UntypedFormControl(null),
  });

  userWallpaperForm = new UntypedFormGroup({
    file: new UntypedFormControl(null),
  });

  membershipPaymentMethodControl = new UntypedFormControl(null, [Validators.required]);

  locationInput?: HTMLInputElement;
  googleIsReadySub?: Subscription;
  autocomplete?: any;
  manage: PlainObject = {};
  stripe: any;
  cardElement?: StripeCardElement;
  cardFormHasErrors = true;
  AlertDivClass = AlertDivClass;

  get isSubscriptionCanceledAndExpired(): boolean {
    if (!this.platform_subscription) {
      return false;
    }
    const now = this.now * 1000;
    const end = this.platform_subscription.current_period_end * 1000;
    const match = now > end;
    // console.log({ now, end, match });
    return match; 
  }

  cardChangeHandler = (event: any) => {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError!.textContent = event.error.message;
      this.cardFormHasErrors = true;
    } else {
      displayError!.textContent = '';
      this.cardFormHasErrors = false;
    }
  }

  stripeOnboardingRefresh = false;

  constructor(
    private userStore: UserStoreService,
    private usersService: UsersService,
    private alertService: AlertService,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    private googleService: GoogleMapsService,
    private stripeService: StripeService,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe({
      next: (queryParams: Params) => {
        console.log({ queryParams });
        this.stripeOnboardingRefresh = !!queryParams['stripeOnboardingRefresh'];
        if (queryParams['stripeOnboardingRefresh']) {
          console.log(`Showing message...`);
          this.alertService.showSuccessMessage(`Stripe Connect onboarding not finished yet. Please finish in order to gain access to app functionality.`);
        }
      }
    });

    this.userStore.getChangesObs().subscribe({
      next: (you: IUser | null) => {
        this.initSettings(you);
      }
    });
  }

  ngAfterViewInit() {
    this.locationInput = <HTMLInputElement> window.document.getElementById('location-input');
    console.log('location-input', this.locationInput);
    this.googleIsReadySub = this.googleService.isReady().subscribe(
      (google: any) => {
        if (google) {
          if (this.googleIsReadySub) {
            this.googleIsReadySub.unsubscribe();
          }
          this.initGoogle(google);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  ngOnDestroy(): void {
    this.cardElement?.off && this.cardElement?.off("change");
  }

  initSettings(you: IUser | null) {
    this.you = you;
    this.setFormsInitialState();

    if (you) {
      // this.usersService.get_user_api_key(you.id).subscribe({
      //   next: (response: ServiceMethodResultsInfo<IApiKey>) => {
      //     this.apiKey = response.data;
      //   }
      // });

      this.usersService.get_user_customer_cards_payment_methods(you.id).subscribe({
        next: (response: any) => {
          this.payment_methods = response.data;
        }
      });

      this.usersService.getSubscriptionActiveStream().subscribe({
        next: (is_subscription_active: boolean) => {
          this.is_subscription_active = is_subscription_active;
        }
      });

      this.usersService.get_platform_subscription(you.id).subscribe({
        next: (response: any) => {
          this.platform_subscription = response.data;
        }
      });

      this.createStripeCustomerCardElement();
    }
  }

  createStripeCustomerCardElement() {
    const stripe = this.stripeService.getStripe();
    const elements = stripe.elements();
    const style = {
      base: {
        color: "#32325d",
      }
    };
    const card = elements.create("card", { style: style });
    const cardId = '#new-card-payment-container';
    card.mount(cardId);

    card.on('change', this.cardChangeHandler);
    this.cardElement = card;
  }

  initGoogle(google: any) {
    if (this.autocomplete) {
      return;
    }
    console.log(`initializing autocomplete`);
    this.autocomplete = new google.maps.places.Autocomplete(this.locationInput);
    google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
      var place = this.autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }
      
      this.manage['place'] = place;
      this.manage['formatted_address'] = place.formatted_address;
      this.manage['latitude'] = place.geometry.location.lat();
      this.manage['longitude'] = place.geometry.location.lng();

      
      this.placeData = {};
      
      // Get each component of the address from the place details
      // and fill the corresponding field on the form.
      for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (this.googleService.componentForm[addressType]) {
          var val = place.address_components[i][this.googleService.componentForm[addressType]];
          this.placeData[this.googleService.switchName(addressType)] = val;
          var elm = document.getElementById(addressType);
          if (elm) { (<any> elm).value = val; };
        }
      }
      if(!this.placeData['city']) {
        this.placeData['city'] = '';
      }
      if(!this.placeData['state']) {
        this.placeData['state'] = '';
      }

      const { city, country, zipcode, route, state, street_number } = this.placeData;
      const location = `${street_number} ${route}, ${city}, ${state} ${zipcode}, ${country}`.trim();
      this.placeData['location'] = location;
      this.placeData['address'] = this.manage['formatted_address'];
      this.placeData['lat'] = this.manage['latitude'];
      this.placeData['lng'] = this.manage['longitude'];

      console.log(this.placeData, place, JSON.stringify(place));
    });
  }

  setFormsInitialState() {
    if (this.you && !this.initState) {
      this.initState = true;
      this.cityQuery = this.you.city;
      this.zipcodeQuery = this.you.zipcode;

      this.userInfoForm.setValue({
        email: this.you.email,
        // phone: this.you.phone,
        username: this.you.username,
        displayname: this.you.displayname,
        // city: this.you.city,
        // state: this.you.state,
        // zipcode: this.you.zipcode,
        // country: this.you.country,
        // tags: this.you.tags ? this.you.tags.split(',') : [],
        location: this.you.location,
        location_id: this.you.location_id,
        location_json: this.you.location_json,
        bio: this.you.bio,
        headline: this.you.headline,
        can_message: this.you.can_message,
        can_converse: this.you.can_converse,
      });
    }
  }

  handleResponseError(error: HttpErrorResponse) {
    this.alertService.showErrorMessage(error.error.message);
    this.loading = false;
  }

  /** on submit methods */

  onSubmitUserInfoForm() {
    const data = {
      ...this.userInfoForm.value,
      ...this.phoneForm.value,
      ...this.placeData,

      phone_is_verified: this.phone_is_verified,
      sms_results: this.sms_results,
    };
    if (this.manage['place']) {
      data.location = this.manage['place'].formatted_address;
      data.location_id = this.manage['place'].place_id;
      data.location_json = JSON.stringify(this.manage['place']);
    }
    this.loading = true;
    this.usersService.update_info(this.you!.id, data)
      .subscribe(
        (response: any) => {
          this.alertService.handleResponseSuccessGeneric(response);
          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          this.loading = false;
          this.handleResponseError(error);
        }
      );
  }

  onSubmitUserPasswordForm() {
    this.loading = true;
    this.usersService.update_password(this.you!.id, this.userPasswordForm.value)
      .subscribe(
        (response: any) => {
          this.alertService.showSuccessMessage(response.message);
          this.userPasswordForm.reset({
            oldPassword: '',
            password: '',
            confirmPassword: '',
          });
          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          this.loading = false;
          this.handleResponseError(error);
        }
      );
  }

  onSubmitUserIconForm(
    userIconFormElm: HTMLFormElement,
    fileInput: HTMLInputElement
  ) {
    // console.log({ userIconFormElm, fileInput });
    const formData = new FormData(userIconFormElm);
    const file = !!fileInput && !!fileInput.files && fileInput.files[0];
    if (!file) {
      const ask = window.confirm(
        `No file was found. Do you want to clear your icon?`
      );
      if (!ask) {
        return;
      }
    }
    formData.append('should_delete', 'true');
    this.loading = true;
    this.usersService.update_icon(this.you!.id, formData)
      .subscribe(
        (response: any) => {
          this.alertService.showSuccessMessage(response.message);
          this.userIconForm.reset();
          if (fileInput) {
            fileInput.value = '';
          }
          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          this.loading = false;
          this.handleResponseError(error);
        }
      );
  }

  onSubmitUserWallpaperForm(
    userWallpaperFormElm: HTMLFormElement,
    fileInput: HTMLInputElement
  ) {
    // console.log({ userWallpaperFormElm, fileInput });
    const formData = new FormData(userWallpaperFormElm);
    const file = !!fileInput && !!fileInput.files && fileInput.files[0];
    if (!file) {
      const ask = window.confirm(
        `No file was found. Do you want to clear your wallpaper?`
      );
      if (!ask) {
        return;
      }
    }
    formData.append('should_delete', 'true');
    this.loading = true;
    this.usersService.update_wallpaper(this.you!.id, formData)
      .subscribe(
        (response: any) => {
          this.alertService.showSuccessMessage(response.message);
          this.userWallpaperForm.reset();
          if (fileInput) {
            fileInput.value = '';
          }
          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          this.loading = false;
          this.handleResponseError(error);
        }
      );
  }

  search(event: any, path: string) {
    const query = event.target.value;
    // console.log(query);
    if (!query || this.loading) {
      return;
    }
    this.loading = true;
    this.loadingPath = path;
    this.clientService.sendRequest<PlainObject>(`/info/locations/usa/${path}?query=${query}`, `GET`, null).subscribe((response: any) => {
      // console.log(response);
      const prop = `usa` + capitalize(path);
      (<any> this)[prop] = response.data;
      this.loading = false;
      this.loadingPath = '';
    });
  }

  send_sms_verification() {
    const phone = this.phoneForm.value.phone 
      ? `1` + this.phoneForm.value.phone
      : 'x';

    this.loading = true;
    if (phone === 'x') {
      const ask = window.confirm(`The phone input was blank. Remove phone from your account?`);
      if (!ask) {
        return;
      }
      this.usersService.send_sms_verification(phone)
        .subscribe(
          (response: any) => {
            this.loading = false;
            window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
            this.userStore.setState(response.data.you);
            this.verification_requested_successfully = false;
            this.sms_results = undefined;
            this.sms_request_id = undefined;
          },
          (error: HttpErrorResponse) => {
            this.loading = false;
            this.handleResponseError(error);
          }
        );
      return;
    }

    this.usersService.send_sms_verification(phone)
      .subscribe(
        (response: any) => {
          this.verification_requested_successfully = true;
          this.sms_results = response.sms_results;
          this.sms_request_id = response.sms_request_id;
        },
        (error: HttpErrorResponse) => {
          this.handleResponseError(error);
        }
      );
  }

  verify_sms_code() {
    this.loading = true;
    this.usersService.verify_sms_code({
      request_id: this.sms_request_id!,
      code: this.phoneVerifyForm.value.code!,
    }).subscribe(
      (response: any) => {
        this.loading = false;
        this.phone_is_verified = true;
        window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
        this.userStore.setState(response.data.you);
        this.alertService.showSuccessMessage(response.message);
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.handleResponseError(error);
      }
    );
  }

  createStripeAccount() {
    this.loading = true;
    const { origin, pathname } = window.location;
    const redirectUrl = origin + pathname;
    this.usersService.create_stripe_account(this.you!.id, redirectUrl).subscribe({
      next: (response: any) => {
        this.loading = false;
        // window.location.href = response.data.onboarding_url;
        window.open(response.data.onboarding_url, `_blank`);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.handleResponseError(error);
      }
    });
  }
    
  createPaymentMethod() {
    const stripe = this.stripeService.getStripe();
      
    this.loading = true;

    stripe.createPaymentMethod({
      type: 'card',
      card: this.cardElement!,
      billing_details: {
        name: getUserFullName(this.you!),
        email: this.you!.email,
        phone: this.you!.phone,
      },
    })
    .then((result: PaymentMethodResult) => {
      // Handle result.error or result.paymentMethod
      
      if (result.error) {
        this.loading = false;
        this.alertService.showErrorMessage(result.error.message || '');
        return;
      }

      // no error
      this.usersService.add_card_payment_method_to_user_customer(this.you!.id, result.paymentMethod.id).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.alertService.handleResponseSuccessGeneric({ message: response.message || '' });
          this.payment_methods.unshift(response.data!);
          this.cardElement!.clear();
          this.cardFormHasErrors = true;
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.alertService.handleResponseErrorGeneric(error);
        },
      });
    });
  }

  removePaymentMethod(paymentMethod: PaymentMethod) {
    const askMsg = `Remove ${paymentMethod.card!.brand.toUpperCase()} card ending in ${paymentMethod.card!.last4}?`;
    const ask = window.confirm(askMsg);
    if (!ask) {
      return;
    }

    this.loading = true;

    this.usersService.remove_card_payment_method_to_user_customer(this.you!.id, paymentMethod.id).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.alertService.handleResponseSuccessGeneric({ message: response.message || '' });

        const index = this.payment_methods.indexOf(paymentMethod);
        this.payment_methods.splice(index, 1);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.alertService.handleResponseErrorGeneric(error);
      },
    });
  }

  create_membership() {
    const askMsg = `The selected payment method will be charged in order to start the membership. Continue?`;
    const ask = window.confirm(askMsg);
    if (!ask) {
      return;
    }

    this.loading = true;
    this.usersService.create_subscription(this.you!.id, this.membershipPaymentMethodControl.value!).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.alertService.handleResponseSuccessGeneric({ message: response.message || '' });
        this.platform_subscription = response.data!.subscription;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.alertService.handleResponseErrorGeneric(error);
      },
    });
  }

  cancel_membership() {
    const askMsg = `The subscription paymentd will stop. After the end of the subscription period, you will lose all membership perks. Continue?`;
    const ask = window.confirm(askMsg);
    if (!ask) {
      return;
    }

    this.loading = true;
    this.usersService.cancel_subscription(this.you!.id).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.alertService.handleResponseSuccessGeneric({ message: response.message || '' });
        this.platform_subscription.status = 'canceled';
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.alertService.handleResponseErrorGeneric(error);
      },
    });
  }
}
