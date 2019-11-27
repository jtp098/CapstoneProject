import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupdetailspagePage } from './groupdetailspage.page';

describe('GroupdetailspagePage', () => {
  let component: GroupdetailspagePage;
  let fixture: ComponentFixture<GroupdetailspagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupdetailspagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupdetailspagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
