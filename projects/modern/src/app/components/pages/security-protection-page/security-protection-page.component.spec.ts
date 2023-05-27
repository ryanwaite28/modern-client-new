import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityProtectionPageComponent } from './security-protection-page.component';

describe('SecurityProtectionPageComponent', () => {
  let component: SecurityProtectionPageComponent;
  let fixture: ComponentFixture<SecurityProtectionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecurityProtectionPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityProtectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
