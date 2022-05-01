import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPaymentCancelPageComponent } from './delivery-payment-cancel-page.component';

describe('DeliveryPaymentCancelPageComponent', () => {
  let component: DeliveryPaymentCancelPageComponent;
  let fixture: ComponentFixture<DeliveryPaymentCancelPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryPaymentCancelPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryPaymentCancelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
