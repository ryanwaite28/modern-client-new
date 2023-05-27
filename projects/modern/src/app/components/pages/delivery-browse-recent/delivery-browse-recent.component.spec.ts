import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryBrowseRecentComponent } from './delivery-browse-recent.component';

describe('DeliveryBrowseRecentComponent', () => {
  let component: DeliveryBrowseRecentComponent;
  let fixture: ComponentFixture<DeliveryBrowseRecentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryBrowseRecentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryBrowseRecentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
