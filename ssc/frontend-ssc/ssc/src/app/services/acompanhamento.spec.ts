import { TestBed } from '@angular/core/testing';

import { AcompanhamentoService } from './acompanhamento';

describe('AcompanhamentoService', () => {
  let service: AcompanhamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcompanhamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
