import { TestBed } from '@angular/core/testing';

import { ParoisseService } from './paroisse.service';

describe('ParoisseService', () => {
  let service: ParoisseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParoisseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
