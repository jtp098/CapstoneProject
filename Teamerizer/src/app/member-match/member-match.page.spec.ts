import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberMatchPage } from './member-match.page';

describe('MemberMatchPage', () => {
  let component: MemberMatchPage;
  let fixture: ComponentFixture<MemberMatchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberMatchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberMatchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
