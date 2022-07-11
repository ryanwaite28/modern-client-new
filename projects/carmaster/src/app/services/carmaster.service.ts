import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MODERN_APPS, USER_RECORDS } from 'projects/common/src/app/enums/all.enums';
import { HttpStatusCode } from 'projects/common/src/app/enums/http-codes.enum';
import { PlainObject } from 'projects/common/src/app/interfaces/json-object.interface';
import { ServiceMethodResultsInfo } from 'projects/common/src/app/interfaces/_common.interface';
import { ClientService } from 'projects/common/src/app/services/client.service';
import { SocketEventsService } from 'projects/common/src/app/services/socket-events.service';
import { get_user_records_endpoint } from 'projects/common/src/app/_misc/chamber';
import { catchError, filter, map, of, Subject, Subscription, take } from 'rxjs';
import { CARMASTER_EVENT_TYPES } from '../enums/car-master.enum';
import { IMechanic } from '../interfaces/carmaster.interface';

@Injectable({
  providedIn: 'root'
})
export class CarmasterService {
  private eventStreamByServiceRequestId: PlainObject<Subject<any>> = {};
  private eventStreamSubByServiceRequestId: PlainObject<Subject<any>> = {};

  isListeningToSocketEvents = false;

  constructor(
    private clientService: ClientService,
    private socketEventsService: SocketEventsService,
  ) { 
    // this.socketEventsService.getServiceIsReady()
    //   .pipe(filter((isReady) => isReady))
    //   .pipe(take(1))
    //   .subscribe({
    //     next: () => {
    //       this.initListeners();
    //     }
    //   });
  }

  private initListeners() {
    // const sub: Subscription = this.socketEventsService.listenToObservableEventStream(MODERN_APPS.CARMASTER, CARMASTER_EVENT_TYPES.NEW_SERVICE_REQUEST_OFFER).subscribe({
    //   next: (event: any) => {
    //     const id = event.service_request_id || event.data.id
    //   }
    // });


  }

  /* 
    Utility/Helper Methods
  */

  getServiceRequestEventStream(id: number) {
    let stream = this.eventStreamByServiceRequestId[id];
    if (!stream) {
      console.log(`No previous stream for service request by id ${id}; registering...`);
      stream = new Subject<any>();
      this.eventStreamByServiceRequestId[id] = stream;
    }
    return stream.asObservable();
  }


  /*
    Request methods
  */

  // messagings

  get_user_messagings(you_id: number, messagings_timestamp?: string, get_all: boolean = false) {
    const endpoint = get_all
      ? '/carmaster/users/' + you_id + '/messagings/all'
      : messagings_timestamp
        ? '/carmaster/users/' + you_id + '/messagings/' + messagings_timestamp
        : '/carmaster/users/' + you_id + '/messagings';
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_messages(you_id: number, user_id: number, min_id?: number) {
    const endpoint = min_id
      ? '/carmaster/users/' + you_id + '/messages/' + user_id + '/' + min_id
      : '/carmaster/users/' + you_id + '/messages/' + user_id;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  send_user_message(you_id: number, user_id: number, data: PlainObject) {
    return this.clientService.sendRequest<any>(`/carmaster/users/${you_id}/send-message/${user_id}`, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  mark_message_as_read(you_id: number, message_id: number) {
    return this.clientService.sendRequest<any>(`/carmaster/users/${you_id}/message/${message_id}/mark-as-read`, `PUT`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  // notifications

  update_user_last_opened_notifications(you_id: number) {
    return this.clientService.sendRequest<any>(`/carmaster/users/${you_id}/notifications/update-last-opened`, `POST`).pipe(
      map((response: any) => {
        // window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
        // this.userStore.setState(response.data.you);
        return response;
      })
    );
  }

  getUserNotificationsAll(user_id: number) {
    const endpoint = get_user_records_endpoint(user_id, MODERN_APPS.CARMASTER, USER_RECORDS.NOTIFICATIONS, undefined, true, false);

    return this.clientService.sendRequest(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getUserNotifications(user_id: number,  min_id?: number) {
    const endpoint = get_user_records_endpoint(user_id, MODERN_APPS.CARMASTER, USER_RECORDS.NOTIFICATIONS, min_id, false, false);

    return this.clientService.sendRequest(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }


  // users

  get_user_service_requests(you_id: number, service_request_id?: number | string, get_all: boolean = false) {
    const endpoint = get_all
      ? '/carmaster/users/' + you_id + '/service-requests/all'
      : service_request_id
        ? '/carmaster/users/' + you_id + '/service-requests/' + service_request_id
        : '/carmaster/users/' + you_id + '/service-requests';
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  create_service_request(you_id: number, data: any) {
    const endpoint = `/carmaster/users/${you_id}/service-request`;
    return this.clientService.sendRequest<any>(endpoint, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  update_service_request(you_id: number, service_request_id: number, data: any) {
    const endpoint = `/carmaster/users/${you_id}/service-request/${service_request_id}`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  deleteservice_request(you_id: number, service_request_id: number) {
    const endpoint = `/carmaster/users/${you_id}/service-request/${service_request_id}`;
    return this.clientService.sendRequest<any>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }


  // mechanic profile

  get_mechanic_service_requests(mechanic_id: number, service_request_id?: number | string, get_all: boolean = false) {
    const endpoint = get_all
      ? '/carmaster/mechanics/' + mechanic_id + '/service-requests/all'
      : service_request_id
        ? '/carmaster/mechanics/' + mechanic_id + '/service-requests/' + service_request_id
        : '/carmaster/mechanics/' + mechanic_id + '/service-requests';
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

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
    const endpoint = `/carmaster/mechanics/search-mechanics`;
    return this.clientService.sendRequest<any>(endpoint, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  search_service_requests(data: any) {
    const endpoint = `/carmaster/mechanics/search-service-requests`;
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



  // service requests

  send_service_request_message(you_id: number, service_request_id: number, data: any) {
    const endpoint = `/carmaster/users/${you_id}/service-request/${service_request_id}/message`;
    return this.clientService.sendRequest<any>(endpoint, `POST`, data).pipe(
      map((response) => {
        return response;
      }) 
    );
  }

  pay_mechanic(you_id: number, service_request_id: number) {
    const endpoint = `/carmaster/users/${you_id}/service-request/${service_request_id}/pay-mechanic`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  mark_service_request_as_work_started(mechanic_id: number, service_request_id: number) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/service-request/${service_request_id}/work-started`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  mark_service_request_as_work_finished(mechanic_id: number, service_request_id: number) {
    const endpoint = `/carmaster/mechanics/${mechanic_id}/service-request/${service_request_id}/work-finished`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
