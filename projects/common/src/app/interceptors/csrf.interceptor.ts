import { Injectable, Provider } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS
} from '@angular/common/http';

import { Observable } from 'rxjs';
import Cookies from 'js-cookie';


const CSRF_COOKIE_NAME = `CSRF-TOKEN`;
const CSRF_HEADER_NAME = `X-CSRF-TOKEN`;


/** Pass untouched request through to the next request handler. */
@Injectable()
export class CsrfInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const CSRF_COOKIE = Cookies.get(CSRF_COOKIE_NAME);
    if (CSRF_COOKIE) {
      req = req.clone({
        headers: req.headers.append(CSRF_HEADER_NAME, CSRF_COOKIE),
        withCredentials: true
      });
    }

    return next.handle(req);
  }
}

export const CsrfProvider: Provider = { provide: HTTP_INTERCEPTORS, multi: true, useClass: CsrfInterceptor };