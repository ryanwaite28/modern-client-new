import { TestBed } from '@angular/core/testing';

import { SocketEventsService } from './socket-events.service';

describe('SocketEventsService', () => {
  let service: SocketEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
