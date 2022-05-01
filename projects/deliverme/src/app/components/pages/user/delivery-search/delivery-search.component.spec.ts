import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverySearchComponent } from './delivery-search.component';

describe('DeliverySearchComponent', () => {
  let component: DeliverySearchComponent;
  let fixture: ComponentFixture<DeliverySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliverySearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
