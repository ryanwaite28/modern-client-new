import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlertsFragmentComponent } from './alerts-fragment.component';

describe('AlertsFragmentComponent', () => {
  let component: AlertsFragmentComponent;
  let fixture: ComponentFixture<AlertsFragmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertsFragmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
