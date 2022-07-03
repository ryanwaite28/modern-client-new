import { TestBed } from '@angular/core/testing';

import { AppSocketEventsStateService } from './app-socket-events-state.service';

describe('AppSocketEventsStateService', () => {
  let service: AppSocketEventsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppSocketEventsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
