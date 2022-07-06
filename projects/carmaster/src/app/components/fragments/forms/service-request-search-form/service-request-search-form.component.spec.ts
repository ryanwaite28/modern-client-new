import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestSearchFormComponent } from './service-request-search-form.component';

describe('MechanicSearchFormComponent', () => {
  let component: ServiceRequestSearchFormComponent;
  let fixture: ComponentFixture<ServiceRequestSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceRequestSearchFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRequestSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
