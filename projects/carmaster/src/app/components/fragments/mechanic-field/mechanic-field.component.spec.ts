import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicFieldComponent } from './mechanic-field.component';

describe('MechanicFieldComponent', () => {
  let component: MechanicFieldComponent;
  let fixture: ComponentFixture<MechanicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechanicFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MechanicFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
