import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicCredentialComponent } from './mechanic-credential.component';

describe('MechanicCredentialComponent', () => {
  let component: MechanicCredentialComponent;
  let fixture: ComponentFixture<MechanicCredentialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechanicCredentialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MechanicCredentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
