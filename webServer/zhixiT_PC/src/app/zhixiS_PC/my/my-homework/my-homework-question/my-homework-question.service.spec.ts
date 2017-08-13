/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MyHomeworkQuestionService } from './my-homework-question.service';

describe('Service: HomeQuestion', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyHomeworkQuestionService]
    });
  });

  it('should ...', inject([MyHomeworkQuestionService], (service: MyHomeworkQuestionService) => {
    expect(service).toBeTruthy();
  }));
});
