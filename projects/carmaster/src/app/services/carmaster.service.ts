import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpStatusCode } from 'projects/common/src/app/enums/http-codes.enum';
import { ServiceMethodResultsInfo } from 'projects/common/src/app/interfaces/_common.interface';
import { ClientService } from 'projects/common/src/app/services/client.service';
import { catchError, map, of } from 'rxjs';
import { IMechanic } from '../interfaces/carmaster.interface';

@Injectable({
  providedIn: 'root'
})
export class CarmasterService {
  constructor(
    private clientService: ClientService
  ) { }

  // mechanic profile

  get_mechanic_by_id(mechanic_id: number) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_mechanic_by_user_id(user_id: number) {
    const endpoint = `/carmaster/mechanics/by-user-id/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  create_mechanic_profile(user_id: number) {
    const endpoint = `/carmaster/mechanics/${user_id}/profile`;
    return this.clientService.sendRequest<IMechanic>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  update_mechanic_profile(mechanic_id: number, data: any) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/profile`;
    return this.clientService.sendRequest<IMechanic>(endpoint, `PUT`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }


  search_mechanics(data: any) {
    const endpoint = `/carmaster/mechanics/search`;
    return this.clientService.sendRequest<any>(endpoint, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }



  // mechanic fields

  get_mechanic_fields(mechanic_id: number) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/field`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }
  
  get_mechanic_field_by_id(mechanic_id: number, field_id: number) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/field/${field_id}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }
  
  create_mechanic_field(mechanic_id: number, data: any) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/field`;
    return this.clientService.sendRequest<any>(endpoint, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }
  
  update_mechanic_field(mechanic_id: number, field_id: number, data: any) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/field/${field_id}`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }
  
  delete_mechanic_field(mechanic_id: number, field_id: number) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/field/${field_id}`;
    return this.clientService.sendRequest<any>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }


  // mechanic credentials

  get_mechanic_credentials(mechanic_id: number) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/credential`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_mechanic_credential_by_id(mechanic_id: number, credential_id: number) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/credential/${credential_id}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  create_mechanic_credential(mechanic_id: number, data: any) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/credential`;
    return this.clientService.sendRequest<any>(endpoint, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  update_mechanic_credential(mechanic_id: number, credential_id: number, data: any) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/credential/${credential_id}`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  delete_mechanic_credential(mechanic_id: number, credential_id: number) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/credential/${credential_id}`;
    return this.clientService.sendRequest<any>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }



  // mechanic expertises

  get_mechanic_expertises(mechanic_id: number) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/expertise`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_mechanic_expertise_by_id(mechanic_id: number, expertise_id: number) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/expertise/${expertise_id}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  create_mechanic_expertise(mechanic_id: number, data: any) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/expertise`;
    return this.clientService.sendRequest<any>(endpoint, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  update_mechanic_expertise(mechanic_id: number, expertise_id: number, data: any) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/expertise/${expertise_id}`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  delete_mechanic_expertise(mechanic_id: number, expertise_id: number) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/expertise/${expertise_id}`;
    return this.clientService.sendRequest<any>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }



  // mechanic services

  get_mechanic_services(mechanic_id: number) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/service`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_mechanic_service_by_id(mechanic_id: number, service_id: number) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/service/${service_id}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  create_mechanic_service(mechanic_id: number, data: any) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/service`;
    return this.clientService.sendRequest<any>(endpoint, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  update_mechanic_service(mechanic_id: number, service_id: number, data: any) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/service/${service_id}`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  delete_mechanic_service(mechanic_id: number, service_id: number) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/service/${service_id}`;
    return this.clientService.sendRequest<any>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }



  // mechanic rating

  create_mechanic_rating(mechanic_id: number, data: any) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/rating`;
    return this.clientService.sendRequest<any>(endpoint, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  create_mechanic_rating_edit(mechanic_id: number, rating_id: number, data: any) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/rating/${rating_id}/edit`;
    return this.clientService.sendRequest<any>(endpoint, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
