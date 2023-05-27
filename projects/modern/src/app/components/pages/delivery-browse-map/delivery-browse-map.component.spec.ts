import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverMeDeliveryBrowseMapPageComponent } from './delivery-browse-map.component';

describe('DeliverMeDeliveryBrowseMapPageComponent', () => {
  let component: DeliverMeDeliveryBrowseMapPageComponent;
  let fixture: ComponentFixture<DeliverMeDeliveryBrowseMapPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliverMeDeliveryBrowseMapPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverMeDeliveryBrowseMapPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
