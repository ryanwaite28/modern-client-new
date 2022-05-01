import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  readonly PRODUCTION = environment.PRODUCTION;
  readonly API_DOMAIN = environment.API_DOMAIN;
  readonly MODERN_DOMAIN = environment.MODERN_DOMAIN;
  readonly APPS = environment.APPS;

  constructor() { }

}
