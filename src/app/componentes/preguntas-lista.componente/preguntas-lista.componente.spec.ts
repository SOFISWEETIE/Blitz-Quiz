import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntasListaComponente } from './preguntas-lista.componente';

describe('PreguntasListaComponente', () => {
  let component: PreguntasListaComponente;
  let fixture: ComponentFixture<PreguntasListaComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreguntasListaComponente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreguntasListaComponente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
