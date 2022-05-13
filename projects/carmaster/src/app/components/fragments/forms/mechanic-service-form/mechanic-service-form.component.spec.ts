import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicServiceFormComponent } from './mechanic-service-form.component';

describe('MechanicServiceFormComponent', () => {
  let component: MechanicServiceFormComponent;
  let fixture: ComponentFixture<MechanicServiceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechanicServiceFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MechanicServiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
