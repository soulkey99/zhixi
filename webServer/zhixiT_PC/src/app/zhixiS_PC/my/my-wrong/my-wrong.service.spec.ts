/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MyWrongService } from './my-wrong.service';

describe('Service: MyWrong', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyWrongService]
    });
  });

  it('should ...', inject([MyWrongService], (service: MyWrongService) => {
    expect(service).toBeTruthy();
  }));
});
