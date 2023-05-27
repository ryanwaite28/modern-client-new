import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryBrowseFeaturedComponent } from './delivery-browse-featured.component';

describe('DeliveryBrowseFeaturedComponent', () => {
  let component: DeliveryBrowseFeaturedComponent;
  let fixture: ComponentFixture<DeliveryBrowseFeaturedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryBrowseFeaturedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryBrowseFeaturedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
