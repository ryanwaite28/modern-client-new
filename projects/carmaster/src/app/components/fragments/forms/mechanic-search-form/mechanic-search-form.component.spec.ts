import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicSearchFormComponent } from './mechanic-search-form.component';

describe('MechanicSearchFormComponent', () => {
  let component: MechanicSearchFormComponent;
  let fixture: ComponentFixture<MechanicSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechanicSearchFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MechanicSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
