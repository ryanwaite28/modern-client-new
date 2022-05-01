import { TestBed } from '@angular/core/testing';

import { UnseenService } from './unseen.service';

describe('UnseenService', () => {
  let service: UnseenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnseenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
