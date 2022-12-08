import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { PaymentMethod } from '@stripe/stripe-js';
import { IMechanicServiceRequest } from 'projects/carmaster/src/app/interfaces/carmaster.interface';
import { service_categories, service_action_types, service_types_by_service_category } from 'projects/carmaster/src/app/utils/car-services.chamber';
import { CARS_MAKES_MODELS, CARS_MAP } from 'projects/carmaster/src/app/utils/cars.chamber';
import { PlainObject } from 'projects/common/src/app/interfaces/json-object.interface';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { IGoogleAutocompleteEvent } from 'projects/common/src/app/interfaces/_common.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { GoogleMapsService } from 'projects/common/src/app/services/google-maps.service';
import { StripeService } from 'projects/common/src/app/services/stripe.service';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { COMMON_CURRENT_DATE } from 'projects/common/src/app/_misc/vault';
import { Subscription, Subject } from 'rxjs';



const default_form_config = [
  // info
  { field: 'title', defaultValue: '', validations: [Validators.required] },
  { field: 'description', defaultValue: '', validations: [Validators.required] },
  { field: 'file', defaultValue: null, validations: [] },

  // expertise
  { field: 'make', defaultValue: '', validations: [] },
  { field: 'model', defaultValue: '', validations: [] },
  { field: 'type', defaultValue: '', validations: [] },
  { field: 'trim', defaultValue: '', validations: [] },
  { field: 'year', defaultValue: null, validations: [] },

  // service
  { field: 'service_category', defaultValue: '', validations: [] },
  { field: 'service_type', defaultValue: '', validations: [] },
  { field: 'service_action', defaultValue: '', validations: [] },
  { field: 'payout', defaultValue: 0, validations: [] },
  { field: 'payment_method_id', defaultValue: '', validations: [Validators.required] },
  
  // location radius
  { field: 'radius', defaultValue: 20, validations: [] },
];

@Component({
  selector: 'carmaster-service-request-form',
  templateUrl: './service-request-form.component.html',
  styleUrls: ['./service-request-form.component.scss']
})
export class ServiceRequestFormComponent implements OnInit, AfterViewInit {
  @ViewChild('formElm') formElm!: ElementRef<HTMLFormElement>;
  @ViewChild('iconInput') iconInput: ElementRef<HTMLInputElement> | any;
  @ViewChild('locationInput') locationInput: ElementRef<HTMLInputElement> | any;

  @Input() service_request?: IMechanicServiceRequest;
  @Input() isEditing: boolean = false;
  @Output() formSubmit = new EventEmitter<any>();
  @Input() you: IUser | any;

  loading = false;

  service_categories = service_categories;
  service_types: string[] = [];
  service_actions = service_action_types;

  cars = CARS_MAKES_MODELS;
  cars_map = CARS_MAP;
  make_models: string[] = [];

  form = new UntypedFormGroup({});

  autocomplete?: any;
  manage: PlainObject = {};
  cityQuery?: string;
  zipcodeQuery?: string;
  placeData: PlainObject = {};
  google: any;
  googleIsReadySub?: Subscription;
  autoCompleteSub?: Subscription;
  autoCompleteSubject?: Subject<IGoogleAutocompleteEvent>;
  autoCompleteResults: IGoogleAutocompleteEvent | null = null;

  chargeFeeData: any;
  acknowledgement_checked = false;
  payment_methods: PaymentMethod[] | null = null;
  is_subscription_active = false;

  constructor(
    private userStore: UserStoreService,
    private usersService: UsersService,
    private stripeService: StripeService,
    private alertService: AlertService,
    private googleMapsService: GoogleMapsService,
  ) { }

  ngOnInit(): void {
    const formGroupConfig: { [key:string]: UntypedFormControl } = {};
    for (const config of default_form_config) {
      formGroupConfig[config.field] = new UntypedFormControl(config.defaultValue, config.validations)
    }
    this.form = new UntypedFormGroup(formGroupConfig);

    this.form.get('service_category')!.valueChanges.subscribe({
      next: (service_category: string) => {
        if (!service_category) {
          return;
        }
        const service_types = service_types_by_service_category[service_category];
        if (!service_types) {
          throw new Error(`Cannot find service types by catgory "${service_category}"`);
        }
        this.service_types = service_types;
      }
    });

    this.form.get('make')!.valueChanges.subscribe({
      next: (make: string) => {
        if (!make) {
          return;
        }
        const car = CARS_MAP[make];
        if (!car) {
          throw new Error(`Cannot find models by make "${make}"`);
        }
        this.make_models = car.models;
      }
    });

    this.chargeFeeData = this.stripeService.add_on_stripe_processing_fee(this.form.value.payout);
    this.form.get('payout')?.valueChanges.subscribe((value) => {
      if (value) {
        this.chargeFeeData = this.stripeService.add_on_stripe_processing_fee(value);
      }
    });

    if (this.isEditing) {
      
    }
  }

  ngAfterViewInit(): void {
    this.userStore.getChangesObs().subscribe((you: IUser | null) => {
      this.you = you;
      this.is_subscription_active = this.usersService.getHasPlatformSubscription();
      
      this.usersService.get_user_customer_cards_payment_methods(this.you.id).subscribe({
        next: (response) => {
          this.payment_methods = response.data;
        }
      });
    });

    this.googleIsReadySub = this.googleMapsService.isReady().subscribe(
      (google) => {
        if (google) {
          this.google = google;
          this.initGoogle(google);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  initGoogle(google: any) {
    console.log(`initializing autocomplete`);
    if (!this.locationInput) {
      return;
    }
    
    this.autoCompleteSubject = this.googleMapsService.makeTextInputIntoLocationAutoComplete(this.locationInput.nativeElement);
    this.autoCompleteSub = this.autoCompleteSubject!.subscribe({
      next: (results) => {
        console.log(results);
        this.autoCompleteResults = results;
      }
    });
  }

  resetForm(
    formElm: HTMLFormElement,
    fileInput: HTMLInputElement
  ) {
    if (!this.isEditing) {
      if (fileInput) {
        fileInput.value = '';
      }

      const defaultFormValue: { [key:string]: any } = {};
      for (const config of default_form_config) {
        defaultFormValue[config.field] = config.defaultValue;
      }
      this.form!.reset(defaultFormValue);
    }
  }

  onSubmit(
    formElm: HTMLFormElement,
  ) {
    if (this.form.invalid || !this.acknowledgement_checked) {
      return console.log(`form invalid.`, this);
    }

    const formData = new FormData(formElm);
    const payload = this.autoCompleteResults
      ? { ...this.form.value, ...this.autoCompleteResults.placeData }
      : { ...this.form.value };

    formData.append(`payload`, JSON.stringify(payload));

    const emitData = {
      formElm: formElm,
      form: this.form,
      formData,
      payload,
      resetForm: () => {
        this.resetForm(formElm, this.iconInput.nativeElement);
      }
    };

    console.log(emitData);
    this.formSubmit.emit(emitData);
  }
}
