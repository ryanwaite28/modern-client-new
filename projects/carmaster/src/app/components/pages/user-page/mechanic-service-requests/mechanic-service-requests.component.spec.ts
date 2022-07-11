import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicServiceRequestsComponent } from './mechanic-service-requests.component';

describe('MechanicServiceRequestsComponent', () => {
  let component: MechanicServiceRequestsComponent;
  let fixture: ComponentFixture<MechanicServiceRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechanicServiceRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MechanicServiceRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
