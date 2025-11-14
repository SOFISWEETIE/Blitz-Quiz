// Componente que representa una sola pregunta
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
  
  // Marca la opción seleccionada por el usuario
  seleccionar(texto: string) {
    this.seleccionada = texto;
  }

  // Comprueba si una opción concreta es la correcta
  // el parametro es la respuesta a comproabar si es correcta
  //  devuelve true si la respuesta coincide con una respuesta marcada como correcta
  esCorrecta(texto: string): boolean {
    return this.pregunta.respuestas.find(r => r.texto === texto)?.correcta || false;
  }
}