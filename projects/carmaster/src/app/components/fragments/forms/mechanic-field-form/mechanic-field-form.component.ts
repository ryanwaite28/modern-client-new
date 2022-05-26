import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMechanicField } from 'projects/carmaster/src/app/interfaces/carmaster.interface';



const default_form_config = [
  { field: 'fieldname', defaultValue: '', validations: [Validators.required] },
  { field: 'fieldvalue', defaultValue: '', validations: [Validators.required] },
];

@Component({
  selector: 'carmaster-mechanic-field-form',
  templateUrl: './mechanic-field-form.component.html',
  styleUrls: ['./mechanic-field-form.component.scss']
})
export class MechanicFieldFormComponent implements OnInit {
  @ViewChild('formElm') formElm!: ElementRef<HTMLFormElement>;

  @Input() field?: IMechanicField;
  @Input() isEditing: boolean = false;

  @Output() formSubmit = new EventEmitter<any>();

  loading = false;

  form = new FormGroup({});

  constructor() { }

  ngOnInit() {
    const formGroupConfig: { [key:string]: FormControl } = {};
    for (const config of default_form_config) {
      const value = this.isEditing ? this.field![config.field] : config.defaultValue
      formGroupConfig[config.field] = new FormControl(value, config.validations)
    }
    this.form = new FormGroup(formGroupConfig);
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
    const payload: any = this.form.value;
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
