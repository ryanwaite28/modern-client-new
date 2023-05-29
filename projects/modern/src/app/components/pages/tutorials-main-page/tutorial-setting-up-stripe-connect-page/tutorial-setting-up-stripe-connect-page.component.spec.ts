import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialSettingUpStripeConnectPageComponent } from './tutorial-setting-up-stripe-connect-page.component';

describe('TutorialSettingUpStripeConnectPageComponent', () => {
  let component: TutorialSettingUpStripeConnectPageComponent;
  let fixture: ComponentFixture<TutorialSettingUpStripeConnectPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorialSettingUpStripeConnectPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialSettingUpStripeConnectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
