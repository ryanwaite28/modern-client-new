import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialStripeCustomerAccountPageComponent } from './tutorial-stripe-customer-account-page.component';

describe('TutorialStripeCustomerAccountPageComponent', () => {
  let component: TutorialStripeCustomerAccountPageComponent;
  let fixture: ComponentFixture<TutorialStripeCustomerAccountPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorialStripeCustomerAccountPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialStripeCustomerAccountPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
