import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveringComponent } from './delivering.component';

describe('DeliveringComponent', () => {
  let component: DeliveringComponent;
  let fixture: ComponentFixture<DeliveringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
