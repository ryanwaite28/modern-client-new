import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IMechanicService } from 'projects/carmaster/src/app/interfaces/carmaster.interface';
import { service_categories, service_action_types, service_types_by_service_category } from 'projects/carmaster/src/app/utils/car-services.chamber';



const default_form_config = [
  { field: 'service_category', defaultValue: '', validations: [Validators.required] },
  { field: 'service_type', defaultValue: '', validations: [Validators.required] },
  { field: 'service_action', defaultValue: '', validations: [Validators.required] },
  { field: 'description', defaultValue: '', validations: [] },
  { field: 'cost', defaultValue: 0, validations: [] },
];

@Component({
  selector: 'carmaster-mechanic-service-form',
  templateUrl: './mechanic-service-form.component.html',
  styleUrls: ['./mechanic-service-form.component.scss']
})
export class MechanicServiceFormComponent implements OnInit {
  @ViewChild('formElm') formElm!: ElementRef<HTMLFormElement>;

  @Input() service?: IMechanicService;
  @Input() isEditing: boolean = false;

  @Output() formSubmit = new EventEmitter<any>();

  loading = false;
  service_categories = service_categories;
  service_types: string[] = [];
  service_actions = service_action_types;
  make_models: string[] = [];

  form = new UntypedFormGroup({});

  constructor() { }

  ngOnInit() {
    const formGroupConfig: { [key:string]: UntypedFormControl } = {};
    for (const config of default_form_config) {
      const value = this.isEditing ? this.service![config.field] : config.defaultValue
      formGroupConfig[config.field] = new UntypedFormControl(value, config.validations)
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

    if (this.isEditing) {
      this.form.get('service_category')?.setValue(this.service?.service_category);
    }
  }

  resetForm(
    formElm: HTMLFormElement
  ) {
    if (!this.isEditing) {
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
    if (this.form.invalid) {
      return console.log(`form invalid.`);
    }
    const formData = new FormData(formElm);
    const payload = this.form.value;
    formData.append(`payload`, JSON.stringify(payload));

    const emitData = {
      formElm: formElm,
      form: this.form,
      formData,
      payload,
      resetForm: () => {
        this.resetForm(formElm);
      }
    };
    console.log(emitData);
    this.formSubmit.emit(emitData);
  }
}
