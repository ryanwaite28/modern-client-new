import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestSearchComponent } from './service-request-search.component';

describe('ServiceRequestSearchComponent', () => {
  let component: ServiceRequestSearchComponent;
  let fixture: ComponentFixture<ServiceRequestSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceRequestSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRequestSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
