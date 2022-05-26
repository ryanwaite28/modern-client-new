import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicExpertiseComponent } from './mechanic-expertise.component';

describe('MechanicExpertiseComponent', () => {
  let component: MechanicExpertiseComponent;
  let fixture: ComponentFixture<MechanicExpertiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechanicExpertiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MechanicExpertiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
