import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialStripeIdentityPageComponent } from './tutorial-stripe-identity-page.component';

describe('TutorialStripeIdentityPageComponent', () => {
  let component: TutorialStripeIdentityPageComponent;
  let fixture: ComponentFixture<TutorialStripeIdentityPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorialStripeIdentityPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialStripeIdentityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
