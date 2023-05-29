import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialInitialScreenPageComponent } from './tutorial-initial-screen-page.component';

describe('TutorialInitialScreenPageComponent', () => {
  let component: TutorialInitialScreenPageComponent;
  let fixture: ComponentFixture<TutorialInitialScreenPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorialInitialScreenPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialInitialScreenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
