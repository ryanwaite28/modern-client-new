import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonUserPageComponent } from './user-page.component';

describe('CommonUserPageComponent', () => {
  let component: CommonUserPageComponent;
  let fixture: ComponentFixture<CommonUserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonUserPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
