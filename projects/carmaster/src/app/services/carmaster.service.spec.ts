import { TestBed } from '@angular/core/testing';

import { CarmasterService } from './carmaster.service';

describe('CarmasterService', () => {
  let service: CarmasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarmasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
