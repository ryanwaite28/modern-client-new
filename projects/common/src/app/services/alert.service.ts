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

  showSuccessMessage(message: string) {
    this.addAlert({
      type: this.AlertTypes.SUCCESS,
      message,
    }, true);
  }

  showErrorMessage(message: string) {
    this.addAlert({
      type: this.AlertTypes.DANGER,
      message,
    }, true);
  }

  showWarningMessage(message: string) {
    this.addAlert({
      type: this.AlertTypes.WARNING,
      message,
    }, true);
  }

  handleResponseSuccessGeneric(response: { message: string }) {
    this.addAlert({
      type: this.AlertTypes.SUCCESS,
      message: response.message
    }, true);
  }

  handleResponseErrorGeneric(error: HttpErrorResponse) {
    this.addAlert({
      type: this.AlertTypes.DANGER,
      message: error.error.message
    }, true);
  }
}
