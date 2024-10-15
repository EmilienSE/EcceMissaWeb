import { TestBed } from '@angular/core/testing';

import { DioceseService } from './diocese.service';

describe('DioceseService', () => {
  let service: DioceseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DioceseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
