/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WrongQuestionDetailService } from './wrong-question-detail.service';

describe('Service: WrongQuestionDetail', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WrongQuestionDetailService]
    });
  });

  it('should ...', inject([WrongQuestionDetailService], (service: WrongQuestionDetailService) => {
    expect(service).toBeTruthy();
  }));
});
