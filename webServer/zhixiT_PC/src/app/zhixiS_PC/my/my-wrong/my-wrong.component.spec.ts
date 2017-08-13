/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MyWrongComponent } from './my-wrong.component';

describe('MyWrongComponent', () => {
  let component: MyWrongComponent;
  let fixture: ComponentFixture<MyWrongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyWrongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWrongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
