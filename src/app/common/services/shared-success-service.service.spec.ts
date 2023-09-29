import { TestBed } from '@angular/core/testing';

import { SharedSuccessServiceService } from './shared-success-service.service';

describe('SharedSuccessServiceService', () => {
  let service: SharedSuccessServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedSuccessServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
