import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialCreateDeliveryListingPageComponent } from './tutorial-create-delivery-listing-page.component';

describe('TutorialCreateDeliveryListingPageComponent', () => {
  let component: TutorialCreateDeliveryListingPageComponent;
  let fixture: ComponentFixture<TutorialCreateDeliveryListingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorialCreateDeliveryListingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialCreateDeliveryListingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
