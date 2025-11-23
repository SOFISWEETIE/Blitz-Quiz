import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeleccionService } from '../../servicios/seleccion.service';
import { PreguntasService } from '../../servicios/preguntas.service';
import { PuntuacionService } from '../../servicios/puntuacion.service';
import { Router } from '@angular/router';
import { Pregunta } from '../../modelos/pregunta.model';

@Component({
  selector: 'app-dificultad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dificultad.component.html',
  
})
export class DificultadComponent {
  dificultades = ['facil', 'media', 'dificil'];

  constructor(
    private seleccion: SeleccionService,
    private preguntasService: PreguntasService,
    private puntuacion: PuntuacionService,
    private router: Router
  ) {}

  async elegir(dif: string) {
  try {

    // === MODO ALEATORIO: ya tiene categoría y dificultad random, pero NO pregunta al usuario ===
    if (this.seleccion.modo === 'aleatorio') {
      const preguntas = await this.preguntasService.obtenerPreguntas(
        this.seleccion.categoria,
        this.seleccion.dificultad
      );

      this.puntuacion.reiniciar();
      this.puntuacion.establecerTotal(preguntas.length);
      this.puntuacion.preguntasActuales = preguntas;
      this.puntuacion.indice = 0;

      this.router.navigate(['/juego']);
      return;
    }

    // === MODO CLÁSICO: flujo normal (elige dificultad) ===
    this.seleccion.establecerDificultad(dif);

    const preguntas = await this.preguntasService.obtenerPreguntas(
      this.seleccion.categoria,
      dif
    );

    this.puntuacion.reiniciar();
    this.puntuacion.establecerTotal(preguntas.length);
    this.puntuacion.preguntasActuales = preguntas;
    this.puntuacion.indice = 0;

    this.router.navigate(['/juego']);

  } catch (error) {
    console.error('Error:', error);
    alert('No se pudieron cargar las preguntas');
  }
}
}