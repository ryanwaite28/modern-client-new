import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { ratingOptions } from 'projects/common/src/app/_misc/vault';



const default_form_config = [
  { field: 'rating', defaultValue: ratingOptions[0], validations: [Validators.required] },
  { field: 'title', defaultValue: '', validations: [] },
  { field: 'summary', defaultValue: '', validations: [] },
];
@Component({
  selector: 'carmaster-mechanic-rating-form',
  templateUrl: './mechanic-rating-form.component.html',
  styleUrls: ['./mechanic-rating-form.component.scss']
})
export class MechanicRatingFormComponent implements OnInit {
  @ViewChild('formElm') formElm!: ElementRef<HTMLFormElement>;

  @Output() formSubmit = new EventEmitter<any>();

  loading = false;
  ratingOptions = ratingOptions;
  you: IUser | null = null;
  form = new UntypedFormGroup({});

  constructor(
    private userStore: UserStoreService,
  ) { }

  ngOnInit() {
    this.userStore.getChangesObs().subscribe({
      next: (you) => {
        this.you = you;
      }
    });

    const formGroupConfig: { [key:string]: UntypedFormControl } = {};
    for (const config of default_form_config) {
      const value = config.defaultValue;
      formGroupConfig[config.field] = new UntypedFormControl(value, config.validations)
    }
    this.form = new UntypedFormGroup(formGroupConfig);
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
    if (!this.you) {
      return;
    }
    if (this.form.invalid) {
      return console.log(`form invalid.`);
    }
    const formData = new FormData(formElm);
    const payload = {
      ...this.form.value,
      writer_id: this.you!.id,
    };
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
