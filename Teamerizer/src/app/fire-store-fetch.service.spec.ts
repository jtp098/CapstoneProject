import { TestBed } from '@angular/core/testing';

import { FireStoreFetchService } from './fire-store-fetch.service';

describe('FireStoreFetchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FireStoreFetchService = TestBed.get(FireStoreFetchService);
    expect(service).toBeTruthy();
  });
});
