import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicCredentialFormComponent } from './mechanic-credential-form.component';

describe('MechanicCredentialFormComponent', () => {
  let component: MechanicCredentialFormComponent;
  let fixture: ComponentFixture<MechanicCredentialFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechanicCredentialFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MechanicCredentialFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
