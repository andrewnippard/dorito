import { TestBed } from '@angular/core/testing';

import { NoderunService } from './noderun.service';

describe('NoderunService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NoderunService = TestBed.get(NoderunService);
    expect(service).toBeTruthy();
  });
});
