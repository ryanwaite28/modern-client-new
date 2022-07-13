import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicServiceRequestOffersPageComponent } from './mechanic-service-request-offers-page.component';

describe('MechanicServiceRequestOffersPageComponent', () => {
  let component: MechanicServiceRequestOffersPageComponent;
  let fixture: ComponentFixture<MechanicServiceRequestOffersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechanicServiceRequestOffersPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MechanicServiceRequestOffersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
