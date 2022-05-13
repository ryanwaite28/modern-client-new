import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicCredentialReportingMessageFormComponent } from './mechanic-credential-reporting-message-form.component';

describe('MechanicCredentialReportingMessageFormComponent', () => {
  let component: MechanicCredentialReportingMessageFormComponent;
  let fixture: ComponentFixture<MechanicCredentialReportingMessageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechanicCredentialReportingMessageFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MechanicCredentialReportingMessageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
