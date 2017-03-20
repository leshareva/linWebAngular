/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TinyComponent } from './tiny.component';

describe('TinyComponent', () => {
  let component: TinyComponent;
  let fixture: ComponentFixture<TinyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TinyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TinyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
