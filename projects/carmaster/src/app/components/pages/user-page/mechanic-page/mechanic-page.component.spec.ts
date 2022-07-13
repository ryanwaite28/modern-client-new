import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicPageComponent } from './mechanic-page.component';

describe('MechanicPageComponent', () => {
  let component: MechanicPageComponent;
  let fixture: ComponentFixture<MechanicPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechanicPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MechanicPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
