import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCreationPage } from './group-creation.page';

describe('GroupCreationPage', () => {
  let component: GroupCreationPage;
  let fixture: ComponentFixture<GroupCreationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupCreationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCreationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
