import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntaComponente } from './pregunta.componente';

describe('PreguntaComponente', () => {
  let component: PreguntaComponente;
  let fixture: ComponentFixture<PreguntaComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreguntaComponente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreguntaComponente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
