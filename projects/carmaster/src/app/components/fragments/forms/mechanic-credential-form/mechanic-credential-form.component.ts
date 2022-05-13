import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMechanicCredential } from 'projects/carmaster/src/app/interfaces/carmaster.interface';


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

  @Output() formSubmit = new EventEmitter<any>();

  loading = false;

  form = new FormGroup({});

  constructor() { }

  ngOnInit() {
    const formGroupConfig: { [key:string]: FormControl } = {};
    for (const config of default_form_config) {
      const value = this.isEditing ? this.credential![config.field] : config.defaultValue
      formGroupConfig[config.field] = new FormControl(value, config.validations)
    }
    this.form = new FormGroup(formGroupConfig);
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
    const formData = new FormData(formElm);
    const payload = this.form.value;
    formData.append(`payload`, JSON.stringify(payload));
    console.log(formElm, this);

    this.formSubmit.emit({
      formElm: formElm,
      form: this.form,
      formData,
      payload,
      fileInput,
      resetForm: () => {
        this.resetForm(formElm, fileInput);
      }
    });
  }
}
