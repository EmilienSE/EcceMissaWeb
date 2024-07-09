import { TestBed } from '@angular/core/testing';

import { EgliseService } from './eglise.service';

describe('EgliseService', () => {
  let service: EgliseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EgliseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
