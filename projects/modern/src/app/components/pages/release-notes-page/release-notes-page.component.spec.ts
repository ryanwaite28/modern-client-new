import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseNotesPageComponent } from './release-notes-page.component';

describe('ReleaseNotesPageComponent', () => {
  let component: ReleaseNotesPageComponent;
  let fixture: ComponentFixture<ReleaseNotesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReleaseNotesPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleaseNotesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
