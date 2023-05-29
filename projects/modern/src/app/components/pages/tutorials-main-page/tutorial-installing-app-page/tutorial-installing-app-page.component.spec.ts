import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialInstallingAppPageComponent } from './tutorial-installing-app-page.component';

describe('TutorialInstallingAppPageComponent', () => {
  let component: TutorialInstallingAppPageComponent;
  let fixture: ComponentFixture<TutorialInstallingAppPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorialInstallingAppPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialInstallingAppPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
