import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserServiceRequestsComponent } from './user-service-requests.component';

describe('UserServiceRequestsComponent', () => {
  let component: UserServiceRequestsComponent;
  let fixture: ComponentFixture<UserServiceRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserServiceRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserServiceRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
