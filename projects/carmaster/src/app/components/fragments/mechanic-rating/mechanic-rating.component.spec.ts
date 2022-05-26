import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicRatingComponent } from './mechanic-rating.component';

describe('MechanicRatingComponent', () => {
  let component: MechanicRatingComponent;
  let fixture: ComponentFixture<MechanicRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechanicRatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MechanicRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
