import { TestBed, inject } from '@angular/core/testing';

import { UtililtyService } from './utililty.service';

describe('UtililtyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtililtyService]
    });
  });

  it('should be created', inject([UtililtyService], (service: UtililtyService) => {
    expect(service).toBeTruthy();
  }));
});
