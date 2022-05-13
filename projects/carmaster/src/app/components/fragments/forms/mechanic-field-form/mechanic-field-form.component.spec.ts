import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicFieldFormComponent } from './mechanic-field-form.component';

describe('MechanicFieldFormComponent', () => {
  let component: MechanicFieldFormComponent;
  let fixture: ComponentFixture<MechanicFieldFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechanicFieldFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MechanicFieldFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
