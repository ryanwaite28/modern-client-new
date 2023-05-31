import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeConnectOnboardingRedirectPageComponent } from './stripe-connect-onboarding-redirect-page.component';

describe('StripeConnectOnboardingRedirectPageComponent', () => {
  let component: StripeConnectOnboardingRedirectPageComponent;
  let fixture: ComponentFixture<StripeConnectOnboardingRedirectPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StripeConnectOnboardingRedirectPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StripeConnectOnboardingRedirectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
