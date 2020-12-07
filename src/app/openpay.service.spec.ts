import { TestBed } from '@angular/core/testing';

import { OpenpayService } from './openpay.service';

describe('OpenpayService', () => {
  let service: OpenpayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenpayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
