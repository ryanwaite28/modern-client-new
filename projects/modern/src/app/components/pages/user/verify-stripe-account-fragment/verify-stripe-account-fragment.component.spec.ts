import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyStripeAccountFragmentComponent } from './verify-stripe-account-fragment.component';

describe('VerifyStripeAccountFragmentComponent', () => {
  let component: VerifyStripeAccountFragmentComponent;
  let fixture: ComponentFixture<VerifyStripeAccountFragmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyStripeAccountFragmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyStripeAccountFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
