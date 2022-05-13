import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicServiceRequestFormComponent } from './mechanic-service-request-form.component';

describe('MechanicServiceRequestFormComponent', () => {
  let component: MechanicServiceRequestFormComponent;
  let fixture: ComponentFixture<MechanicServiceRequestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechanicServiceRequestFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MechanicServiceRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
