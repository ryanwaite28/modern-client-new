import { Injectable } from '@angular/core';
import { IAlert } from '../interfaces/alert.interface';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { copyObj } from '../_misc/clone-object';
import { AlertTypes } from '../enums/all.enums';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertsList: IAlert[] = [];
  private newAlert = new Subject<{ alertObj: IAlert, autoClose: boolean }>();

  AlertTypes = AlertTypes;

  constructor() { }

  getObservabe() {
    const observable = this.newAlert.asObservable();
    return observable;
  }

  getList() {
    const copy = copyObj(this.alertsList);
    return copy as IAlert[];
  }

  addAlert(alertObj: IAlert, autoClose: boolean = true) {
    if (!alertObj || !alertObj.message || !alertObj.type) {
      console.warn(`Bad alert arg`, alertObj);
      return;
    }
    this.alertsList.push(alertObj);
    this.newAlert.next({ alertObj, autoClose });
  }

  removeAlert(alertObj: IAlert) {
    const index = this.alertsList.findIndex((a) => {
      const match = (
        a.type === alertObj.type &&
        a.message === alertObj.message
      );
      return match;
    });
    const resultFound = index > -1;
    if (resultFound) {
      this.alertsList.splice(index, 1);
    }
  }

  showSuccessMessage(message: string, autoClose: boolean = true) {
    this.addAlert({
      type: this.AlertTypes.SUCCESS,
      message,
    }, autoClose);
  }

  showErrorMessage(message: string, autoClose: boolean = true) {
    this.addAlert({
      type: this.AlertTypes.DANGER,
      message,
    }, autoClose);
  }

  showWarningMessage(message: string, autoClose: boolean = true) {
    this.addAlert({
      type: this.AlertTypes.WARNING,
      message,
    }, autoClose);
  }

  handleResponseSuccessGeneric(response?: Partial<{ message: string }>, autoClose: boolean = true) {
    if (!response || !response.message) {
      return;
    }
    this.addAlert({
      type: this.AlertTypes.SUCCESS,
      message: response.message
    }, autoClose);
  }

  handleResponseErrorGeneric(error?: HttpErrorResponse, autoClose: boolean = true) {
    if (!error) {
      return;
    }
    this.addAlert({
      type: this.AlertTypes.DANGER,
      message: error.error.message
    }, autoClose);
  }
}
