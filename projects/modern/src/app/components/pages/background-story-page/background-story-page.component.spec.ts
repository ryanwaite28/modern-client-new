import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundStoryPageComponent } from './background-story-page.component';

describe('BackgroundStoryPageComponent', () => {
  let component: BackgroundStoryPageComponent;
  let fixture: ComponentFixture<BackgroundStoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackgroundStoryPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundStoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
