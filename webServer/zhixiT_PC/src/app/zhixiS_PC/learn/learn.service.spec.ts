/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LearnService } from './learn.service';

describe('Service: Learn', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LearnService]
    });
  });

  it('should ...', inject([LearnService], (service: LearnService) => {
    expect(service).toBeTruthy();
  }));
});
