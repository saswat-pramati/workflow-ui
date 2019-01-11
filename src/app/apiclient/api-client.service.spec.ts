import { TestBed, inject } from '@angular/core/testing';

import { ApiClientService } from './api-client.service';

describe('ApiClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiClientService]
    });
  });

  it('should be created', inject([ApiClientService], (service: ApiClientService) => {
    expect(service).toBeTruthy();
  }));
});
