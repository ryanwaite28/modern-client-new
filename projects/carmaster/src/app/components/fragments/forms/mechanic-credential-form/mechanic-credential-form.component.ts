import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IMechanicCredential } from 'projects/carmaster/src/app/interfaces/carmaster.interface';
import { IFormSubmitEvent } from 'projects/common/src/app/interfaces/_common.interface';


const default_form_config = [
  { field: 'title', defaultValue: '', validations: [Validators.required] },
  { field: 'description', defaultValue: '', validations: [] },
  { field: 'website', defaultValue: '', validations: [] },
  { field: 'file', defaultValue: null, validations: [] },
];

@Component({
  selector: 'carmaster-mechanic-credential-form',
  templateUrl: './mechanic-credential-form.component.html',
  styleUrls: ['./mechanic-credential-form.component.scss']
})
export class MechanicCredentialFormComponent implements OnInit {
  @ViewChild('formElm') formElm!: ElementRef<HTMLFormElement>;

  @Input() credential?: IMechanicCredential;
  @Input() isEditing: boolean = false;

  @Output() formSubmit = new EventEmitter<IFormSubmitEvent>();

  loading = false;

  form = new UntypedFormGroup({});

  constructor() { }

  ngOnInit() {
    const formGroupConfig: { [key:string]: UntypedFormControl } = {};
    for (const config of default_form_config) {
      const value = this.isEditing ? this.credential![config.field] : config.defaultValue
      formGroupConfig[config.field] = new UntypedFormControl(value, config.validations)
    }
    this.form = new UntypedFormGroup(formGroupConfig);
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
    fileInput: HTMLInputElement
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
        this.resetForm(formElm, fileInput);
      }
    };
    console.log(emitData);
    this.formSubmit.emit(emitData);
  }
}
