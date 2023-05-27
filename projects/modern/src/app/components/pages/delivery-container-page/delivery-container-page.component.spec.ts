import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryContainerPageComponent } from './delivery-container-page.component';

describe('DeliveryContainerPageComponent', () => {
  let component: DeliveryContainerPageComponent;
  let fixture: ComponentFixture<DeliveryContainerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryContainerPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryContainerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
