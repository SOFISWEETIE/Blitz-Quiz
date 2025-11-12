import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Pregunta } from '../modelos/pregunta.modelo';

@Component({
  selector: 'app-pregunta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pregunta.componente.html',
  styleUrl: './pregunta.componente.css'
})
export class PreguntaComponente {
  @Input() pregunta!: Pregunta;
  seleccionada: string | null = null;

  seleccionar(texto: string) {
    this.seleccionada = texto;
  }

  esCorrecta(texto: string): boolean {
    return this.pregunta.respuestas.find(r => r.texto === texto)?.correcta || false;
  }
}