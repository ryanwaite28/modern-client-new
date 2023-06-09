import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperApiPageComponent } from './developer-api-page.component';

describe('DeveloperApiPageComponent', () => {
  let component: DeveloperApiPageComponent;
  let fixture: ComponentFixture<DeveloperApiPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeveloperApiPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeveloperApiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
