import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MODERN_APPS, USER_RECORDS } from 'projects/common/src/app/enums/all.enums';
import { IModelRating } from 'projects/common/src/app/interfaces/_common.interface';
import { ClientService } from 'projects/common/src/app/services/client.service';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { IDelivery } from '../interfaces/deliverme.interface';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  constructor(
    private userService: UsersService,
    private clientService: ClientService,
  ) {}


  getUserDeliveriesAll<T = any>(user_id: number) {
    return this.userService.get_user_records<T>(
      user_id,
      MODERN_APPS.DELIVERME,
      USER_RECORDS.DELIVERIES,
      undefined,
      true,
      true
    );
  }

  getUserDeliveries<T = any>(user_id: number, min_id?: number) {
    return this.userService.get_user_records<T>(
      user_id,
      MODERN_APPS.DELIVERME,
      USER_RECORDS.DELIVERIES,
      min_id,
      false,
      true
    );
  }

  get_delivery_by_id<T = any>(delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/${delivery_id}`, `GET`);
  }

  create_delivery<T = any>(data: FormData) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries`, `POST`, data);
  }

  update_delivery<T = any>(data: FormData, delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/${delivery_id}`, `PUT`, data);
  }

  delete_delivery<T = any>(delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/${delivery_id}`, `DELETE`);
  }

  getUserPastDeliveringsAll<T = any>(user_id: number) {
    return this.userService.get_user_records(
      user_id,
      MODERN_APPS.DELIVERME,
      USER_RECORDS.DELIVERINGS,
      undefined,
      true,
      true
    );
  }

  getUserPastDeliverings<T = any>(user_id: number, min_id?: number) {
    return this.userService.get_user_records<T>(
      user_id,
      MODERN_APPS.DELIVERME,
      USER_RECORDS.DELIVERINGS,
      min_id,
      false,
      true
    );
  }

  getUserDelivering<T = any>(user_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${user_id}/delivering`, `GET`);
  }

  findAvailableDeliveryByFromCityAndState<T = any>(city: string, state: string) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/find-available-from/city/${city}/state/${state}`, `GET`);
  }

  findAvailableDeliveryByToCityAndState<T = any>(city: string, state: string) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/find-available-to/city/${city}/state/${state}`, `GET`);
  }

  findAvailableDelivery<T = any>(data: any) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/find-available`, `POST`, data);
  }

  assignDelivery<T = any>(you_id: number, delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${you_id}/assign-delivery/${delivery_id}`, `POST`);
  }

  unassignDelivery<T = any>(you_id: number, delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${you_id}/unassign-delivery/${delivery_id}`, `POST`);
  }

  markDeliveryAsPickedUp<T = any>(you_id: number, delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${you_id}/mark-delivery-as-picked-up/${delivery_id}`, `POST`);
  }

  markDeliveryAsDroppedOff<T = any>(you_id: number, delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${you_id}/mark-delivery-as-dropped-off/${delivery_id}`, `POST`);
  }

  add_delivered_picture<T = any>(you_id: number, delivery_id: number, data: FormData) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${you_id}/add-delivered-picture/${delivery_id}`, `POST`, data);
  }

  markDeliveryAsReturned<T = any>(you_id: number, delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${you_id}/mark-delivery-as-returned/${delivery_id}`, `POST`);
  }

  markDeliveryAsCompleted<T = any>(you_id: number, delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${you_id}/mark-delivery-as-completed/${delivery_id}`, `POST`);
  }

  createTrackingUpdate<T = any>(you_id: number, delivery_id: number, data: FormData) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${you_id}/create-tracking-update/${delivery_id}`, `POST`, data);
  }

  addDeliveredPicture<T = any>(you_id: number, delivery_id: number, data: FormData) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${you_id}/add-delivered-picture/${delivery_id}`, `POST`, data);
  }
  
  getUserDelivermeSettings<T = any>(you_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${you_id}/settings`, `GET`);
  }
  
  updateUserDelivermeSettings<T = any>(you_id: number, data: any) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${you_id}/settings`, `POST`, data);
  }
  
  searchDeliveries(data: any) {
    return this.clientService.sendRequest<IDelivery[]>(`/deliverme/deliveries/search`, `POST`, data);
  }
  
  sendDeliveryMessage<T = any>(data: any) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/${data.delivery_id}/message`, `POST`, data);
  }
  
  payCarrier<T = any>(you_id: number, delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/${delivery_id}/pay-carrier`, `POST`);
  }

  createPaymentIntent<T = any>(delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/${delivery_id}/create-payment-intent`, `POST`);
  }

  browseRecent(delivery_id?: number) {
    const endpoint = delivery_id
      ? `/deliverme/deliveries/browse-recent/${delivery_id}`
      : `/deliverme/deliveries/browse-recent`;
    return this.clientService.sendRequest<IDelivery[]>(endpoint, `POST`, null);
  }

  browseMap(params: {
    northEast: { lat: number, lng: number },
    southWest: { lat: number, lng: number },
  }) {
    const { northEast, southWest } = params;
    const endpoint = `/deliverme/deliveries/browse-map/swlat/${southWest.lat}/swlng/${southWest.lng}/nelat/${northEast.lat}/nelng/${northEast.lng}`;
    return this.clientService.sendRequest<IDelivery[]>(endpoint, `POST`, null);
  }

  getUserStats(user_id: number) {
    return this.clientService.sendRequest<{
      user_ratings_info: IModelRating | null,
      writer_ratings_info: IModelRating | null,
    }>(`/deliverme/users/${user_id}/stats`, `GET`, null);
  }

  request_carrier_location<T = any>(delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/${delivery_id}/request-carrier-location`, `POST`);
  }

  accept_request_carrier_location<T = any>(delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/${delivery_id}/accept-request-carrier-location`, `POST`);
  }

  decline_request_carrier_location<T = any>(delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/${delivery_id}/decline-request-carrier-location`, `POST`);
  }

  carrier_share_location<T = any>(delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/${delivery_id}/carrier-share-location`, `POST`);
  }

  carrier_unshare_location<T = any>(delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/${delivery_id}/carrier-unshare-location`, `POST`);
  }

  carrier_update_location<T = any>(params: {
    delivery_id: number,
    carrier_latest_lat: number,
    carrier_latest_lng: number,
  }) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/${params.delivery_id}/carrier-update-location`, `POST`, params);
  }
}
