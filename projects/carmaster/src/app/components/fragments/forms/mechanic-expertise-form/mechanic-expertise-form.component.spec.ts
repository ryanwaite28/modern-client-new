import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicExpertiseFormComponent } from './mechanic-expertise-form.component';

describe('MechanicExpertiseFormComponent', () => {
  let component: MechanicExpertiseFormComponent;
  let fixture: ComponentFixture<MechanicExpertiseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechanicExpertiseFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MechanicExpertiseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
