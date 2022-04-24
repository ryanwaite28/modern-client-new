import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  readonly PRODUCTION = environment.production;
  readonly DOMAIN = environment.DOMAIN;

  constructor() { }

}
