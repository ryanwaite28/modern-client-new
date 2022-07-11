import { TestBed } from '@angular/core/testing';

import { UserIsMechanicGuard } from './user-is-mechanic.guard';

describe('UserIsMechanicGuard', () => {
  let guard: UserIsMechanicGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserIsMechanicGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
