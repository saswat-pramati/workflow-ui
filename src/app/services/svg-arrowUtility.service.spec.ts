import { TestBed, inject } from '@angular/core/testing';

import { SvgArrowUtilityService } from './svg-arrowUtility.service';

describe('SvgArrowutilityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SvgArrowUtilityService]
    });
  });

  it('should be created', inject([SvgArrowUtilityService], (service: SvgArrowUtilityService) => {
    expect(service).toBeTruthy();
  }));
});
