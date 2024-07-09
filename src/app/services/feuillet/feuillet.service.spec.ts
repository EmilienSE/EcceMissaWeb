import { TestBed } from '@angular/core/testing';

import { FeuilletService } from './feuillet.service';

describe('FeuilletService', () => {
  let service: FeuilletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeuilletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
