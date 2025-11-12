import { Component, OnInit } from '@angular/core';
import { PreguntaServicio } from '../../servicios/pregunta.servicio';
import { Pregunta } from '../../modelos/pregunta.modelo';
import { AsyncPipe } from '@angular/common';
import { PreguntaComponente } from '../../pregunta.componente/pregunta.componente';
import { Observable } from 'rxjs';
import { CommonModule} from '@angular/common';

@Component({
  selector: 'app-preguntas-lista',
  standalone: true,
  imports: [CommonModule, AsyncPipe, PreguntaComponente],
  templateUrl: './preguntas-lista.componente.html',
  styleUrl: './preguntas-lista.componente.css'
})
export class PreguntasListaComponente {
  preguntas$!: Observable<Pregunta[]>;

  constructor(private preguntaServicio: PreguntaServicio) {
    this.preguntas$ = this.preguntaServicio.obtenerPreguntas();
  }

}
