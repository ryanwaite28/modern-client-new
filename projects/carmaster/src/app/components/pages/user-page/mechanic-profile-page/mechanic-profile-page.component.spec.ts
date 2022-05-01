import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicProfilePageComponent } from './mechanic-profile-page.component';

describe('MechanicProfilePageComponent', () => {
  let component: MechanicProfilePageComponent;
  let fixture: ComponentFixture<MechanicProfilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechanicProfilePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MechanicProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
