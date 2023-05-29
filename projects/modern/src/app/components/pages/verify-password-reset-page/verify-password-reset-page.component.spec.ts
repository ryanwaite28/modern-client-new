import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyPasswordResetPageComponent } from './verify-password-reset-page.component';

describe('VerifyPasswordResetPageComponent', () => {
  let component: VerifyPasswordResetPageComponent;
  let fixture: ComponentFixture<VerifyPasswordResetPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyPasswordResetPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyPasswordResetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
