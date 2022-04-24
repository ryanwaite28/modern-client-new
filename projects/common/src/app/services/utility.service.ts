import { Injectable } from '@angular/core';
import { USER_TYPES } from '../enums/all.enums';
// import { ContentChange } from 'ngx-quill';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  isJwtFormat(value: any) {
    return !!value && (/[a-zA-Z0-9]+\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+/).test(value);
  }

}
