import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeIdentityVerificationUploadPageComponent } from './stripe-identity-verification-upload-page.component';

describe('StripeIdentityVerificationUploadPageComponent', () => {
  let component: StripeIdentityVerificationUploadPageComponent;
  let fixture: ComponentFixture<StripeIdentityVerificationUploadPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StripeIdentityVerificationUploadPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StripeIdentityVerificationUploadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
