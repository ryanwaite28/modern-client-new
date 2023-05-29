import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialSignupPageComponent } from './tutorial-signup-page.component';

describe('TutorialSignupPageComponent', () => {
  let component: TutorialSignupPageComponent;
  let fixture: ComponentFixture<TutorialSignupPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorialSignupPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialSignupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
