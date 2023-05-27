import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalDetailsPageComponent } from './technical-details-page.component';

describe('TechnicalDetailsPageComponent', () => {
  let component: TechnicalDetailsPageComponent;
  let fixture: ComponentFixture<TechnicalDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicalDetailsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
