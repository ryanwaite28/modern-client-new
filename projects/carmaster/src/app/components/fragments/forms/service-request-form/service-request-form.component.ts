import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { IMechanicServiceRequest } from 'projects/carmaster/src/app/interfaces/carmaster.interface';
import { service_categories, service_action_types, service_types_by_service_category } from 'projects/carmaster/src/app/utils/car-services.chamber';
import { CARS_MAKES_MODELS, CARS_MAP } from 'projects/carmaster/src/app/utils/cars.chamber';
import { PlainObject } from 'projects/common/src/app/interfaces/json-object.interface';
import { IGoogleAutocompleteEvent } from 'projects/common/src/app/interfaces/_common.interface';
import { GoogleMapsService } from 'projects/common/src/app/services/google-maps.service';
import { COMMON_CURRENT_DATE } from 'projects/common/src/app/_misc/vault';
import { Subscription, Subject } from 'rxjs';



const default_form_config = [
  // info
  { field: 'title', defaultValue: '', validations: [Validators.required] },
  { field: 'description', defaultValue: '', validations: [Validators.required] },

  // expertise
  { field: 'make', defaultValue: '', validations: [] },
  { field: 'model', defaultValue: '', validations: [] },
  { field: 'type', defaultValue: '', validations: [] },
  { field: 'trim', defaultValue: '', validations: [] },
  { field: 'min_year', defaultValue: null, validations: [] },
  { field: 'max_year', defaultValue: null, validations: [] },

  // service
  { field: 'service_category', defaultValue: '', validations: [] },
  { field: 'service_type', defaultValue: '', validations: [] },
  { field: 'service_action', defaultValue: '', validations: [] },
  { field: 'payout', defaultValue: 0, validations: [] },
  
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
  @Input() service_request?: IMechanicServiceRequest;
  @Input() isEditing: boolean = false;
  @Output() formSubmit = new EventEmitter<any>();

  locationInput?: HTMLInputElement;
  loading = false;

  service_categories = service_categories;
  service_types: string[] = [];
  service_actions = service_action_types;

  cars = CARS_MAKES_MODELS;
  cars_map = CARS_MAP;
  make_models: string[] = [];

  form = new FormGroup({});

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

  constructor(
    private googleService: GoogleMapsService,
  ) { }

  ngOnInit(): void {
    const formGroupConfig: { [key:string]: FormControl } = {};
    for (const config of default_form_config) {
      formGroupConfig[config.field] = new FormControl(config.defaultValue, config.validations)
    }
    this.form = new FormGroup(formGroupConfig);

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

    if (this.isEditing) {
      
    }
  }

  ngAfterViewInit() {
    this.locationInput = <HTMLInputElement> window.document.getElementById('location-input');
    console.log('location-input', this.locationInput);
    this.googleIsReadySub = this.googleService.isReady().subscribe(
      (google: any) => {
        if (google) {
          this.google = google;
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

  initGoogle(google: any) {
    console.log(`initializing autocomplete`);
    if (!this.locationInput) {
      return;
    }
    
    this.autoCompleteSubject = this.googleService.makeTextInputIntoLocationAutoComplete(this.locationInput);
    this.autoCompleteSub = this.autoCompleteSubject!.subscribe({
      next: (results) => {
        console.log(results);
        this.autoCompleteResults = results;
      }
    });
  }

  resetForm(
    formElm: HTMLFormElement
  ) {
    const defaultFormValue: { [key:string]: any } = {};
    for (const config of default_form_config) {
      defaultFormValue[config.field] = config.defaultValue;
    }
    this.form!.reset(defaultFormValue);
  }

  onSubmit(
    formElm: HTMLFormElement,
  ) {
    if (this.form.invalid) {
      return console.log(`form invalid.`);
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
        // this.resetForm(formElm);
      }
    };
    console.log(emitData);
    this.formSubmit.emit(emitData);
  }
}
