import { TestBed } from '@angular/core/testing';

import { QueryParameterControlService } from './query-parameter-control.service';

describe('QueryParameterControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QueryParameterControlService = TestBed.get(QueryParameterControlService);
    expect(service).toBeTruthy();
  });
});
