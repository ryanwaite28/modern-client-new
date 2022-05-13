import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicRatingFormComponent } from './mechanic-rating-form.component';

describe('MechanicRatingFormComponent', () => {
  let component: MechanicRatingFormComponent;
  let fixture: ComponentFixture<MechanicRatingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechanicRatingFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MechanicRatingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
