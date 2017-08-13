/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DoHomeworkService } from './do-homework.service';

describe('Service: DoHomework', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DoHomeworkService]
    });
  });

  it('should ...', inject([DoHomeworkService], (service: DoHomeworkService) => {
    expect(service).toBeTruthy();
  }));
});
