import { Injectable } from '@angular/core';
import { ClientService } from './client.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { first, flatMap, map, share, single, take } from 'rxjs/operators';
import {
  SignUpResponse,
  SignInResponse,
  GenericApiResponse,
  GetVerifySmsCode,
} from '../interfaces/responses.interface';
import {
  PlainObject
} from '../interfaces/json-object.interface';
import { UserStoreService } from '../stores/user-store.service';
import { INotification } from '../interfaces/notification.interface';
import { IUserField } from '../interfaces/user-field.interface';
import { MODERN_APPS, USER_RECORDS } from '../enums/all.enums';
import { HttpStatusCode } from '../enums/http-codes.enum';
import { UtilityService } from './utility.service';
import { IApiKey, IUserNotificationsLastOpenedByApp, IUserSubscriptionInfo } from '../interfaces/_common.interface';
import { EnvironmentService } from './environment.service';
import { clone, get_user_app_notifications_endpoint, get_user_records_endpoint } from '../_misc/chamber';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  session: GenericApiResponse | any;
  sessionChecked: boolean = false;
  private is_subscription_active: boolean = false;
  private is_subscription_active_stream = new BehaviorSubject<boolean>(this.is_subscription_active);
  private notificationsLastOpenedByApp: PlainObject<IUserNotificationsLastOpenedByApp> = {};

  private isFirstCall = true;

  constructor(
    public http: HttpClient,
    private userStore: UserStoreService,
    private clientService: ClientService,
    private utilityService: UtilityService,
    private envService: EnvironmentService,
  ) {}

  getNotificationsLastOpenedByAppObj() {
    return { ...this.notificationsLastOpenedByApp };
  }

  getHasPlatformSubscription(): boolean {
    return this.is_subscription_active;
  }

  getSubscriptionActiveStream() {
    return this.is_subscription_active_stream.asObservable();
  }

  checkUserSession(): Observable<IUser | null> {
    return this.userStore.getChangesObs().pipe(
      flatMap((you: IUser | null) => {
        return you !== undefined
          ? of(you)
          : this.checkSession().pipe(
              map((response: GenericApiResponse) => {
                return response.data.you || null;
              })
            );
      })
    );
  }

  private checkSession() {
    const jwt = window.localStorage.getItem('rmw-modern-apps-jwt');
    const badJwt = !jwt || jwt === `undefined`;// || !this.utilityService.isJwtFormat(jwt);
    console.log({ badJwt });
    if (badJwt) {
      window.localStorage.removeItem('rmw-modern-apps-jwt');
      this.userStore.setState(null);
      return of(<GenericApiResponse> {
        message: `no token found`,
        data: {
          online: false,
          you: null,
          token: null,
        }
      });
    }
    return this.clientService.sendRequest<any>(
      '/users/check-session',
      `GET`,
      null,
    ).pipe(
      map((response) => {
        this.session = response;
        this.sessionChecked = true;
        if (response.data?.is_subscription_active) {
          this.is_subscription_active = response.data.is_subscription_active;
          this.is_subscription_active_stream.next(this.is_subscription_active);
        }
        this.userStore.setState(response.data!.you);
        if (response.data!.token) {
          window.localStorage.setItem('rmw-modern-apps-jwt', response.data!.token);
        }
        return response;
      })
    );
  }

  use_jwt_from_url(jwt: string) {
    window.localStorage.setItem('rmw-modern-apps-jwt', jwt);
    return this.checkSession()
  }

  sign_out() {
    // return of().pipe(
    //   map(() => {
    //     this.userStore.setState(null);
    //     window.localStorage.removeItem('rmw-modern-apps-jwt');
    //     console.log(`signed out`);
    //   })
    // );

    this.userStore.setState(null);
    window.localStorage.removeItem('rmw-modern-apps-jwt');
    console.log(`signed out`);
  }

  verify_email(uuid: string): Observable<GenericApiResponse> {
    const endpoint = '/users/verify-email/' + uuid;
    return this.clientService.sendRequest<GenericApiResponse>(endpoint, `GET`).pipe(
      map((response) => {
        this.userStore.setState(null);
        window.localStorage.removeItem('rmw-modern-apps-jwt');
        return response;
      })
    );
  }

  send_sms_verification(phone: string): Observable<GenericApiResponse> {
    const endpoint = '/users/send-sms-verification/' + phone;
    return this.clientService.sendRequest<GenericApiResponse>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  verify_sms_code(params: {
    request_id: string,
    code: string,
  }): Observable<GetVerifySmsCode> {
    const { request_id, code } = params;
    const endpoint = `/users/verify-sms-code/request_id/${request_id}/code/${code}`;
    return this.clientService.sendRequest<GetVerifySmsCode>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  send_feedback(you_id: number, data: PlainObject) {
    const endpoint = `/users/${you_id}/feedback`;
    return this.clientService.sendRequest<any>(endpoint, `POST`, data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  /** */

  get_user_by_id(id: number) {
    const endpoint = '/users/id/' + id;
    return this.clientService.sendRequest<IUser>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_by_phone(phone: string) {
    const endpoint = '/users/phone/' + phone;
    return this.clientService.sendRequest<IUser>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  check_user_follows(you_id: number, user_id: number) {
    const endpoint = `/users/${you_id}/follows/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_followers_count(user_id: number) {
    const endpoint = `/users/${user_id}/followers-count`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_followings_count(user_id: number) {
    const endpoint = `/users/${user_id}/followings-count`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_messagings(you_id: number, messagings_timestamp?: string, get_all: boolean = false) {
    const endpoint = get_all
      ? '/users/' + you_id + '/messagings/all'
      : messagings_timestamp
        ? '/users/' + you_id + '/messagings/' + messagings_timestamp
        : '/users/' + you_id + '/messagings';
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_messages(you_id: number, user_id: number, min_id?: number) {
    const endpoint = min_id
      ? '/users/' + you_id + '/messages/' + user_id + '/' + min_id
      : '/users/' + you_id + '/messages/' + user_id;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_unseen_counts(you_id: number) {
    const endpoint = `/users/${you_id}/unseen-counts`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_api_key(you_id: number) {
    const endpoint = `/users/${you_id}/api-key`;
    return this.clientService.sendRequest<IApiKey>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_customer_cards_payment_methods(you_id: number) {
    const endpoint = `/users/${you_id}/customer-cards-payment-methods`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  // generic

  get_user_records<T>(
    user_id: number,
    app: MODERN_APPS,
    path: USER_RECORDS,
    min_id?: number,
    get_all: boolean = false,
    is_public: boolean = true
  ) {
    const endpoint = get_user_records_endpoint(user_id, app, path, min_id, get_all, is_public);
    return this.clientService.sendRequest(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_random_models(
    you_id: number,
    model_name: string,
    industry: string = '',
    gallup_strength: string = '',
    pred_ref_profile: string = '',
    cause: string = '',
  ) {
    const endpoint = `/users/${you_id}/random?model_name=${model_name}&industry=${industry}&gallup_strength=${gallup_strength}&pred_ref_profile=${pred_ref_profile}&cause=${cause}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_feed(you_id: number, feed_type: string, min_id?: number) {
    const endpoint = min_id
      ? `/users/${you_id}/feed/${min_id}?feed_type=${feed_type}`
      : `/users/${you_id}/feed?feed_type=${feed_type}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  //

  getUserNotificationsAll<T = any>(user_id: number) {
    return this.get_user_records<T>(
      user_id,
      MODERN_APPS.COMMON,
      USER_RECORDS.NOTIFICATIONS,
      undefined,
      true,
      false
    );
  }

  getUserNotifications<T = any>(user_id: number, min_id?: number) {
    return this.get_user_records<T>(
      user_id,
      MODERN_APPS.COMMON,
      USER_RECORDS.NOTIFICATIONS,
      min_id,
      false,
      false
    );
  }

  getUserAppNotificationsAll<T = any>(user_id: number, micro_app: MODERN_APPS) {
    const endpoint = get_user_app_notifications_endpoint(
      user_id,
      micro_app,
      USER_RECORDS.NOTIFICATIONS,
      undefined,
      true,
      false
    );
    return this.clientService.sendRequest<any>(endpoint, `GET`);
  }

  getUserAppNotifications<T = any>(user_id: number, micro_app: MODERN_APPS, min_id?: number) {
    const endpoint = get_user_app_notifications_endpoint(
      user_id,
      micro_app,
      USER_RECORDS.NOTIFICATIONS,
      min_id,
      false,
      false
    );
    return this.clientService.sendRequest<any>(endpoint, `GET`);
  }

  getUserAppNotificationsLastOpened(you_id: number, micro_app: MODERN_APPS) {
    return this.clientService.sendRequest<IUserNotificationsLastOpenedByApp>(`/users/${you_id}/notifications/app/${micro_app}/app-notifications-last-opened`, `GET`).pipe(
      map((response) => {
        this.notificationsLastOpenedByApp[micro_app] = response.data!;
        return response;
      })
    );
  }

  updateUserAppNotificationsLastOpened(you_id: number, micro_app: MODERN_APPS) {
    return this.clientService.sendRequest<IUserNotificationsLastOpenedByApp>(`/users/${you_id}/notifications/app/${micro_app}/update-app-notifications-last-opened`, `POST`).pipe(
      map((response) => {
        this.notificationsLastOpenedByApp[micro_app] = response.data!;
        return response;
      })
    );
  }

  /** POST */

  sign_up(data: PlainObject) {
    return this.clientService.sendRequest<any>('/common/users', `POST`, data).pipe(
      map((response) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
        this.userStore.setState(response.data.you);
        return response;
      })
    );
  }

  create_user_field(id: number, data: PlainObject) {
    return this.clientService.sendRequest<GenericApiResponse<IUserField>>(`/users/${id}/user-field`, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  follow_user(you_id: number, user_id: number) {
    const endpoint = `/users/${you_id}/follows/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  send_user_message(you_id: number, user_id: number, data: PlainObject) {
    return this.clientService.sendRequest<any>(`/users/${you_id}/send-message/${user_id}`, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  update_user_last_opened(you_id: number) {
    return this.clientService.sendRequest<any>(`/users/${you_id}/notifications/update-last-opened`, `POST`).pipe(
      map((response: any) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
        this.userStore.setState(response.data.you);
        return response;
      })
    );
  }

  update_conversation_last_opened(you_id: number, conversation_id: number) {
    return this.clientService.sendRequest<any>(`/users/${you_id}/conversations/${conversation_id}/update-last-opened`, `PUT`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  add_card_payment_method_to_user_customer(you_id: number, payment_method_id: string) {
    const endpoint = `/users/${you_id}/customer-cards-payment-methods/${payment_method_id}`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }
  
  /** PUT */
  
  create_stripe_account<T = any>(you_id: number) {
    return this.clientService.sendRequest<GenericApiResponse<T>>(
      `/users/${you_id}/create-stripe-account`, `PUT`
    ).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  verify_stripe_account<T = any>(you_id: number) {
    return this.clientService.sendRequest<GenericApiResponse<T>>(
      `/users/${you_id}/verify-stripe-account`, `PUT`
    ).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  verify_stripe_account_via_uuid<T = any>(user_uuid: string) {
    return this.clientService.sendRequest<GenericApiResponse<T>>(
      `/users/${user_uuid}/verify-stripe-account-by-uuid`, `PUT`
    ).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  sign_in(data: PlainObject) {
    return this.clientService.sendRequest<any>('/common/users', `PUT`, data).pipe(
      map((response) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
        this.userStore.setState(response.data.you);
        return response;
      })
    );
  }

  update_info(id: number, data: PlainObject) {
    const endpoint = `/users/${id}/info`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, data).pipe(
      map((response) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
        this.userStore.mergeState(response.data.you);
        return response;
      })
    );
  }

  update_password(id: number, data: PlainObject) {
    const endpoint = `/users/${id}/password`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, data).pipe(
      map((response) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
        this.userStore.mergeState(response.data.you);
        return response;
      })
    );
  }

  update_phone(id: number, data: PlainObject) {
    const endpoint = `/users/${id}/phone`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, data).pipe(
      map((response) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
        this.userStore.mergeState(response.data.you);
        return response;
      })
    );
  }

  update_icon(id: number, formData: FormData) {
    const endpoint = `/users/${id}/icon`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, formData).pipe(
      map((response) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
        this.userStore.mergeState(response.data.you);
        return response;
      })
    );
  }

  update_wallpaper(id: number, formData: FormData) {
    const endpoint = `/users/${id}/wallpaper`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, formData).pipe(
      map((response) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
        this.userStore.mergeState(response.data.you);
        return response;
      })
    );
  }

  update_user_field(you_id: number, id: number, data: PlainObject) {
    const endpoint = `/users/${you_id}/user-field/${id}`;
    return this.clientService.sendRequest<IUserField>(endpoint, `PUT`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  submit_reset_password_request(email: string) {
    const endpoint = `/users/${email}/password-reset`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  submit_password_reset_code(code: string) {
    const endpoint = `/users/password-reset/${code}`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /** DELETE */

  delete_user_field(you_id: number, id: number) {
    const endpoint = `/users/${you_id}/user-field/${id}`;
    return this.clientService.sendRequest<GenericApiResponse>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  unfollow_user(you_id: number, user_id: number) {
    const endpoint = `/users/${you_id}/follows/${user_id}`;
    return this.clientService.sendRequest<GenericApiResponse>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  remove_card_payment_method_to_user_customer(you_id: number, payment_method_id: string) {
    const endpoint = `/users/${you_id}/customer-cards-payment-methods/${payment_method_id}`;
    return this.clientService.sendRequest<any>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }



  get_platform_subscription(you_id: number) {
    const endpoint = `/users/${you_id}/get-subscription`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_platform_subscription_info(user_id: number) {
    const endpoint = `/users/${user_id}/get-subscription-info`;
    return this.clientService.sendRequest<IUserSubscriptionInfo | null>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  check_subscription_active(you_id: number) {
    const endpoint = `/users/${you_id}/is-subscription-active`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  create_subscription(you_id: number, payment_method_id: string) {
    const endpoint = `/users/${you_id}/create-subscription/${payment_method_id}`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
        this.userStore.setState(response.data.you);
        this.is_subscription_active = true;
        this.is_subscription_active_stream.next(this.is_subscription_active);
        return response;
      })
    );
  }

  cancel_subscription(you_id: number) {
    const endpoint = `/users/${you_id}/cancel-subscription`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
