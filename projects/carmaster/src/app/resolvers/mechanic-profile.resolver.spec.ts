import { TestBed } from '@angular/core/testing';

import { MechanicProfileResolver } from './mechanic-profile.resolver';

describe('MechanicProfileResolver', () => {
  let resolver: MechanicProfileResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(MechanicProfileResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
