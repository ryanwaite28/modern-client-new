import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestCardComponent } from './service-request-card.component';

describe('ServiceRequestCardComponent', () => {
  let component: ServiceRequestCardComponent;
  let fixture: ComponentFixture<ServiceRequestCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceRequestCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRequestCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
