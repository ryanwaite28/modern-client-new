import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFieldsComponent } from './user-fields.component';

describe('UserFieldsComponent', () => {
  let component: UserFieldsComponent;
  let fixture: ComponentFixture<UserFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
