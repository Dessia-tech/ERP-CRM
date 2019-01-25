import { TestBed } from '@angular/core/testing';

import { MeetingsService } from './meetings.service';

describe('MeetingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MeetingsService = TestBed.get(MeetingsService);
    expect(service).toBeTruthy();
  });
});
