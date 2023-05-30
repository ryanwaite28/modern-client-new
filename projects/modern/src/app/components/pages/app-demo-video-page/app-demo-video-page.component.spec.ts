import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDemoVideoPageComponent } from './app-demo-video-page.component';

describe('AppDemoVideoPageComponent', () => {
  let component: AppDemoVideoPageComponent;
  let fixture: ComponentFixture<AppDemoVideoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppDemoVideoPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppDemoVideoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
