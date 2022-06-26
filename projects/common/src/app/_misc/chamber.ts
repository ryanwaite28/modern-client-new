import { ActivatedRouteSnapshot } from '@angular/router';
import { MODERN_APPS, USER_RECORDS } from '../enums/all.enums';
import { INotification } from '../interfaces/notification.interface';
import { IUser } from '../interfaces/user.interface';
import { checkPrimitive } from './clone-object';

export function getRouteParamKey<T = any>(key: string, route: ActivatedRouteSnapshot, recursiveParent: boolean = false): T | null {
  const value = route.params[key];
  if (value) {
    return value;
  }

  if (recursiveParent && route.parent) {
    return getRouteParamKey(key, route.parent, recursiveParent);
  } else {
    return null;
  }
}

export function capitalize(str: string) {
  if (!str) {
    return '';
  } else if (str.length < 2) {
    return str.toUpperCase();
  }
  const Str = str.toLowerCase();
  const capitalized = Str.charAt(0).toUpperCase() + Str.slice(1);
  return capitalized;
}

export const getUserFullName = (user: IUser) => {
  if (user) {
    const { firstname, middlename, lastname } = user;
    const middle = middlename
      ? ` ${middlename} `
      : ` `;

    const displayName = `${firstname}${middle}${lastname}`;
    return displayName;
  } else {
    return '';
  }
};

export const getNotificationActionMessage = (notification: INotification): string | null => {
  return null;
}

export const getFullNotificationMessage = (notification: INotification): string | null => {
  return null;
}


/**
 * Copy Object
 * ---
 *
 * Deep copy object via recursion call.
 * - for primitives, just return the given argument.
 * - for Dates, call new Date instance with argument and return it
 * - for arrays, create new array and push recursive call for each item
 * - for object, create new object and set each key to recursive call
 *
 * @param {*} obj 
 * @returns {object}
 */
export function clone<T>  (obj: any): T  {
  const isPrimitive = checkPrimitive(obj);
  if (isPrimitive) {
    return obj;
  }
  if (obj.constructor === Date) {
    const newDate = new Date(obj);
    return newDate as unknown as T;
  }

  let copy: any;
  if (obj.constructor === Array) {
    copy = [];
    for (const item of <Array<any>> obj) {
      const copyItem = clone(item);
      copy.push(copyItem);
    }
  } else if (obj.constructor === Object) {
    copy = {};
    const keys = Object.keys(obj);
    for (const key of keys) {
      const copyItem = clone(obj[key]);
      copy[key] = copyItem;
    }
  } else if (obj.constructor === Map) {
    copy = new Map();
    (<Map<any, any>> obj).forEach((value, key) => {
      const copyItem = clone(value);
      copy.set(key, copyItem);
    });
  }

  const typedCopy = copy as T;
  return typedCopy;
};

export function get_user_records_endpoint(
  user_id: number,
  app: MODERN_APPS,
  path: USER_RECORDS,
  min_id?: number,
  get_all: boolean = false,
  is_public: boolean = true
) {
  const partial_prefix = is_public ? '/get-' : '/';
  const endpoint = get_all
    ? '/' + app + '/users/' + user_id + partial_prefix + path + '/all'
    : min_id
      ? '/' + app + '/users/' + user_id + `${partial_prefix}` + path + '/' + min_id
      : '/' + app + '/users/' + user_id + `${partial_prefix}` + path;
  return endpoint;
}