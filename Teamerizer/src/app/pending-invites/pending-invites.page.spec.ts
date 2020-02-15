import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingInvitesPage } from './pending-invites.page';

describe('PendingInvitesPage', () => {
  let component: PendingInvitesPage;
  let fixture: ComponentFixture<PendingInvitesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingInvitesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingInvitesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
