import { TestBed } from '@angular/core/testing';

import { DeleteserviceService } from './deleteservice.service';

describe('DeleteserviceService', () => {
  let service: DeleteserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
