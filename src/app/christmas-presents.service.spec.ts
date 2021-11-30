import { TestBed } from '@angular/core/testing';

import { ChristmasPresentsService } from './christmas-presents.service';

describe('ChristmasPresentsServiceService', () => {
  let service: ChristmasPresentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChristmasPresentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
