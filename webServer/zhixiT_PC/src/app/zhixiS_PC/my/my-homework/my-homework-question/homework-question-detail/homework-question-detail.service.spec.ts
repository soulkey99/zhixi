/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HomeworkQuestionDetailService } from './homework-question-detail.service';

describe('Service: HomeworkQuestionDetail', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HomeworkQuestionDetailService]
    });
  });

  it('should ...', inject([HomeworkQuestionDetailService], (service: HomeworkQuestionDetailService) => {
    expect(service).toBeTruthy();
  }));
});
