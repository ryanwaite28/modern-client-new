import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialViewStripeConnectedAccountProfilePageComponent } from './tutorial-view-stripe-connected-account-profile-page.component';

describe('TutorialViewStripeConnectedAccountProfilePageComponent', () => {
  let component: TutorialViewStripeConnectedAccountProfilePageComponent;
  let fixture: ComponentFixture<TutorialViewStripeConnectedAccountProfilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorialViewStripeConnectedAccountProfilePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialViewStripeConnectedAccountProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
