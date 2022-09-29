import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyStripeAccountComponent } from './verify-stripe-account.component';

describe('VerifyStripeAccountComponent', () => {
  let component: VerifyStripeAccountComponent;
  let fixture: ComponentFixture<VerifyStripeAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyStripeAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyStripeAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
