import { TestBed } from '@angular/core/testing';

import { IsMechanicGuard } from './is-mechanic.guard';

describe('IsMechanicGuard', () => {
  let guard: IsMechanicGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsMechanicGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
