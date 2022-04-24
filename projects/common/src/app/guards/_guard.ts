import { Observable } from 'rxjs';

export type CanActivateReturn =
  Observable<boolean> |
  Promise<boolean> |
  boolean;

export type ResolveType<T> =
  Observable<T> |
  Promise<T> |
  T;