import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpPagePage } from './sign-up-page.page';

describe('SignUpPagePage', () => {
  let component: SignUpPagePage;
  let fixture: ComponentFixture<SignUpPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
