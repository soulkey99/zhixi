/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AddClassService } from './add-class.service';

describe('Service: AddClass', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddClassService]
    });
  });

  it('should ...', inject([AddClassService], (service: AddClassService) => {
    expect(service).toBeTruthy();
  }));
});
