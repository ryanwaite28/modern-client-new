import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialLoginPageComponent } from './tutorial-login-page.component';

describe('TutorialLoginPageComponent', () => {
  let component: TutorialLoginPageComponent;
  let fixture: ComponentFixture<TutorialLoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorialLoginPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
