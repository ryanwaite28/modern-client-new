import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialsMainPageComponent } from './tutorials-main-page.component';

describe('TutorialsMainPageComponent', () => {
  let component: TutorialsMainPageComponent;
  let fixture: ComponentFixture<TutorialsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorialsMainPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
