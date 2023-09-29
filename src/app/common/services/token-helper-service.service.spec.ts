import { TestBed } from '@angular/core/testing';

import { TokenHelperServiceService } from './token-helper-service.service';

describe('TokenHelperServiceService', () => {
  let service: TokenHelperServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenHelperServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
