import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicCredentialReportingFormComponent } from './mechanic-credential-reporting-form.component';

describe('MechanicCredentialReportingFormComponent', () => {
  let component: MechanicCredentialReportingFormComponent;
  let fixture: ComponentFixture<MechanicCredentialReportingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechanicCredentialReportingFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MechanicCredentialReportingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
