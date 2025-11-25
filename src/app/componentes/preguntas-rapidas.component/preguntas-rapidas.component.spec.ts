import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntasRapidasComponent } from './preguntas-rapidas.component';

describe('PreguntasRapidasComponent', () => {
  let component: PreguntasRapidasComponent;
  let fixture: ComponentFixture<PreguntasRapidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreguntasRapidasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreguntasRapidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
