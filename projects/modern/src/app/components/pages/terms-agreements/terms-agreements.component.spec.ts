import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAgreementsComponent } from './terms-agreements.component';

describe('TermsAgreementsComponent', () => {
  let component: TermsAgreementsComponent;
  let fixture: ComponentFixture<TermsAgreementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsAgreementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAgreementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
