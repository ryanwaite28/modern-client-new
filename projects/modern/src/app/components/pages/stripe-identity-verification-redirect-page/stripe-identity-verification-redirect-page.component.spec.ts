import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeIdentityVerificationRedirectPageComponent } from './stripe-identity-verification-redirect-page.component';

describe('StripeIdentityVerificationRedirectPageComponent', () => {
  let component: StripeIdentityVerificationRedirectPageComponent;
  let fixture: ComponentFixture<StripeIdentityVerificationRedirectPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StripeIdentityVerificationRedirectPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StripeIdentityVerificationRedirectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
