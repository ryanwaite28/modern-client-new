import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialSearchFulfillDeliveryListingPageComponent } from './tutorial-search-fulfill-delivery-listing-page.component';

describe('TutorialSearchFulfillDeliveryListingPageComponent', () => {
  let component: TutorialSearchFulfillDeliveryListingPageComponent;
  let fixture: ComponentFixture<TutorialSearchFulfillDeliveryListingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorialSearchFulfillDeliveryListingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialSearchFulfillDeliveryListingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
