import { TestBed } from '@angular/core/testing';

import { PreguntaServicio } from './pregunta.servicio';

describe('PreguntaServicio', () => {
  let service: PreguntaServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreguntaServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
