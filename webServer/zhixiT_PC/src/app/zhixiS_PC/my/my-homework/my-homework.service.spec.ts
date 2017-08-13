/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MyHomeworkService } from './my-homework.service';

describe('Service: MyHomework', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyHomeworkService]
    });
  });

  it('should ...', inject([MyHomeworkService], (service: MyHomeworkService) => {
    expect(service).toBeTruthy();
  }));
});
