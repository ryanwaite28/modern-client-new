import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { ServiceMethodResultsInfo } from '../interfaces/_common.interface';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  DOMAIN: string = '';
  API_PREFIX: string = '';
  isProd: boolean = false;

  private xsrf_token_ready = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService,
  ) {
    this.isProd = this.environmentService.PRODUCTION;
    this.DOMAIN = this.environmentService.DOMAIN;
    const apiDomain = this.DOMAIN + '/apps';
    this.API_PREFIX = apiDomain;
  }

  setApiContext(options: {
    DOMAIN: string;
    API_PREFIX: string;
    isProd: boolean;
  }) {
    this.DOMAIN = options.DOMAIN;
    this.API_PREFIX = options.API_PREFIX;
    this.isProd = options.isProd;
  }

  isXsrfTokenReady() {
    return this.xsrf_token_ready.asObservable();
  }

  getXsrfToken() {
    return this.sendRequest<any>(`/common/utils/get-xsrf-token-pair`, 'GET')
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          throw error;
        })
      );
  }

  sendRequest<T = any>(
    route: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: object | FormData | null,
    customHeaders?: HttpHeaders,
    report_progress: boolean = false,
  ): Observable<ServiceMethodResultsInfo<T>> {
    const api_url = this.API_PREFIX + route;
    const jwt = window.localStorage.getItem('rmw-modern-apps-jwt') || '';
    const httpOptions = {
      withCredentials: true,
      reportProgress: report_progress,
      headers: customHeaders || new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${jwt}`
      }),
    };
    if (data && data.constructor === Object) {
      httpOptions.headers = httpOptions.headers.set('Content-Type', 'application/json');
    }

    let requestObservable: Observable<ServiceMethodResultsInfo<T>>;

    switch (method) {
      case 'GET': {
        requestObservable = (<any> this.http.get(api_url, httpOptions)) as Observable<ServiceMethodResultsInfo<T>>;
        break;
      }
      case 'POST': {
        requestObservable = (<any> this.http.post(api_url, data, httpOptions)) as Observable<ServiceMethodResultsInfo<T>>;
        break;
      }
      case 'PUT': {
        requestObservable = (<any> this.http.put(api_url, data, httpOptions)) as Observable<ServiceMethodResultsInfo<T>>;
        break;
      }
      case 'DELETE': {
        requestObservable = (<any> this.http.delete(api_url, httpOptions)) as Observable<ServiceMethodResultsInfo<T>>;
        break;
      }
    }

    return requestObservable;
  }
}
