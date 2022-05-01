import { TestBed } from '@angular/core/testing';

import { UserSubscriptionInfoResolver } from './user-subscription-info.resolver';

describe('UserSubscriptionInfoResolver', () => {
  let resolver: UserSubscriptionInfoResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(UserSubscriptionInfoResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
