import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgUploaderPage } from './img-uploader.page';

describe('ImgUploaderPage', () => {
  let component: ImgUploaderPage;
  let fixture: ComponentFixture<ImgUploaderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImgUploaderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgUploaderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
