/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UploadConceptComponent } from './upload-concept.component';

describe('UploadConceptComponent', () => {
  let component: UploadConceptComponent;
  let fixture: ComponentFixture<UploadConceptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadConceptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadConceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
