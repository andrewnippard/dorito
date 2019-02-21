import { TestBed } from '@angular/core/testing';

import { NodeRunService } from './noderun.service';

describe('NoderunService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NodeRunService = TestBed.get(NodeRunService);
    expect(service).toBeTruthy();
  });
});
