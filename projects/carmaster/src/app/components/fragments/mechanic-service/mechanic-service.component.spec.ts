import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicServiceComponent } from './mechanic-service.component';

describe('MechanicServiceComponent', () => {
  let component: MechanicServiceComponent;
  let fixture: ComponentFixture<MechanicServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechanicServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MechanicServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
