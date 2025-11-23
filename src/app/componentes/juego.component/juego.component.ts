import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuntuacionService } from '../../servicios/puntuacion.service';
import { SeleccionService } from '../../servicios/seleccion.service';
import { PreguntasService } from '../../servicios/preguntas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-juego',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './juego.component.html',
  styleUrl: './juego.component.css'
})
export class JuegoComponent {

  private indiceCorrectaMezclada: number = 0;

  constructor(
    public puntuacion: PuntuacionService,
    public seleccion: SeleccionService,
    private router: Router,
    private preguntasService: PreguntasService
  ) {
    // Si no hay preguntas → cargamos según el modo
    if (this.puntuacion.preguntasActuales.length === 0) {
      this.cargarPreguntas();
    }
  }

  private async cargarPreguntas() {
    try {
      // MODO ALEATORIO: elige categoría y dificultad al azar y carga directo
      if (this.seleccion.modo === 'aleatorio') {
        const categorias = ['Arte', 'Ciencia', 'Deporte', 'Entretenimiento', 'Geografia', 'Historia'];
        const dificultades = ['facil', 'media', 'dificil'];

        const cat = categorias[Math.floor(Math.random() * categorias.length)];
        const dif = dificultades[Math.floor(Math.random() * dificultades.length)];

        this.seleccion.establecerCategoria(cat);
        this.seleccion.establecerDificultad(dif);

        const preguntas = await this.preguntasService.obtenerPreguntas(cat, dif);

        this.puntuacion.reiniciar();
        this.puntuacion.establecerTotal(preguntas.length);
        this.puntuacion.preguntasActuales = preguntas;
      }

      // MODO CLÁSICO: ya viene con categoría y dificultad elegidas
      else if (this.seleccion.modo === 'clasico') {
        const preguntas = await this.preguntasService.obtenerPreguntas(
          this.seleccion.categoria,
          this.seleccion.dificultad
        );

        this.puntuacion.reiniciar();
        this.puntuacion.establecerTotal(preguntas.length);
        this.puntuacion.preguntasActuales = preguntas;
      }

    } catch (error) {
      alert('Error cargando las preguntas');
      this.router.navigate(['/modos']);
    }
  }

  // Mezcla las opciones (funciona perfecto con string o number)
  respuestasMezcladas(): string[] {
  const pregunta = this.preguntaActual();
  if (!pregunta?.opciones) return [];

  let opciones = [...pregunta.opciones];

  // Mezclamos
  for (let i = opciones.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
  }

  // Guardamos cuál es la correcta después de mezclar
  this.correctaActual = pregunta.correcta; // ← guardamos el texto

  return opciones;
}

// Variable para guardar la correcta (texto)
private correctaActual: string = '';

// Responder (SÚPER SIMPLE Y SEGURO)
responder(respuestaSeleccionada: string) {
  const esCorrecta = respuestaSeleccionada === this.correctaActual;

  if (esCorrecta) {
    this.puntuacion.sumarAcierto();
  }

  this.puntuacion.indice++;

  if (this.puntuacion.indice >= this.puntuacion.preguntasActuales.length) {
    this.router.navigate(['/resultados']);
  }
}

  preguntaActual() {
    return this.puntuacion.preguntasActuales[this.puntuacion.indice];
  }

  numeroPregunta() {
    return this.puntuacion.indice + 1;
  }

  totalPreguntas() {
    return this.puntuacion.totalPreguntas;
  }
}