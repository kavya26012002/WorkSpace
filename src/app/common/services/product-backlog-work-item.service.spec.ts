import { TestBed } from '@angular/core/testing';

import { ProductBacklogWorkItemService } from './product-backlog-work-item.service';

describe('ProductBacklogWorkItemService', () => {
  let service: ProductBacklogWorkItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductBacklogWorkItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
