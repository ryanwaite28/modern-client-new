import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestFormComponent } from './service-request-form.component';

describe('ServiceRequestFormComponent', () => {
  let component: ServiceRequestFormComponent;
  let fixture: ComponentFixture<ServiceRequestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceRequestFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
