import { TestBed } from '@angular/core/testing';

import { Acompanhamento } from './acompanhamento';

describe('Acompanhamento', () => {
  let service: Acompanhamento;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Acompanhamento);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
