import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMechanicExpertise } from 'projects/carmaster/src/app/interfaces/carmaster.interface';
import { CARS_MAKES_MODELS, CARS_MAP } from 'projects/carmaster/src/app/utils/cars.chamber';
import { COMMON_CURRENT_DATE } from 'projects/common/src/app/_misc/vault';


const default_form_config = [
  { field: 'description', defaultValue: '', validations: [] },
  { field: 'make', defaultValue: '', validations: [Validators.required] },
  { field: 'model', defaultValue: '', validations: [Validators.required] },
  { field: 'type', defaultValue: '', validations: [] },
  { field: 'trim', defaultValue: '', validations: [] },
  { field: 'min_year', defaultValue: null, validations: [Validators.required, Validators.min(1960), Validators.max(COMMON_CURRENT_DATE.getFullYear())] },
  { field: 'max_year', defaultValue: null, validations: [Validators.required, Validators.min(1960), Validators.max(COMMON_CURRENT_DATE.getFullYear())] },
];

@Component({
  selector: 'carmaster-mechanic-expertise-form',
  templateUrl: './mechanic-expertise-form.component.html',
  styleUrls: ['./mechanic-expertise-form.component.scss']
})
export class MechanicExpertiseFormComponent implements OnInit {
  @ViewChild('formElm') formElm!: ElementRef<HTMLFormElement>;

  @Input() expertise?: IMechanicExpertise;
  @Input() isEditing: boolean = false;

  @Output() formSubmit = new EventEmitter<any>();

  loading = false;
  cars = CARS_MAKES_MODELS;
  cars_map = CARS_MAP;
  make_models: string[] = [];

  form = new FormGroup({});

  constructor() { }

  ngOnInit() {
    const formGroupConfig: { [key:string]: FormControl } = {};
    for (const config of default_form_config) {
      const value = this.isEditing ? this.expertise![config.field] : config.defaultValue
      formGroupConfig[config.field] = new FormControl(value, config.validations)
    }
    this.form = new FormGroup(formGroupConfig);

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
    formElm: HTMLFormElement
  ) {
    const formData = new FormData(formElm);
    const payload = this.form.value;
    formData.append(`payload`, JSON.stringify(payload));
    console.log(formElm, this);

    this.formSubmit.emit({
      formElm: formElm,
      form: this.form,
      formData,
      payload,
      fileInput: null,
      resetForm: () => {
        this.resetForm(formElm);
      }
    });
  }
}
