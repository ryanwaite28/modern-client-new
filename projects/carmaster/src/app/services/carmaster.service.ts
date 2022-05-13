import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpStatusCode } from 'projects/common/src/app/enums/http-codes.enum';
import { ServiceMethodResultsInfo } from 'projects/common/src/app/interfaces/_common.interface';
import { ClientService } from 'projects/common/src/app/services/client.service';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarmasterService {

  constructor(
    private clientService: ClientService
  ) { }

  get_mechanic_by_id(id: number) {
    const endpoint = `/carmaster/mechanics/${id}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_mechanic_by_user_id(id: number) {
    const endpoint = `/carmaster/mechanics/by-user-id/${id}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  create_mechanic_profile(id: number) {
    const endpoint = `/carmaster/mechanics/${id}/create-profile`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
