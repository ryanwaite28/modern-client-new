import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPaymentSuccessPageComponent } from './delivery-payment-success-page.component';

describe('DeliveryPaymentSuccessPageComponent', () => {
  let component: DeliveryPaymentSuccessPageComponent;
  let fixture: ComponentFixture<DeliveryPaymentSuccessPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryPaymentSuccessPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryPaymentSuccessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
