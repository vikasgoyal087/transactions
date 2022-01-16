import { TestBed } from '@angular/core/testing';

import { TransactionLocalStorageService } from './transaction-local-storage.service';

describe('TransactionLocalStorageService', () => {
  let service: TransactionLocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionLocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
