import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuntuacionService } from '../../servicios/puntuacion.service';

/**
 * Componente específico para preguntas en MODO BLITZ (rápidas y estresantes).
 * Timer random corto (4-8s), puntos altos si respondes rápido, penalizaciones si fallas o te duermes.
 * Emite el resultado al padre para avanzar y actualizar stats.
 */
@Component({
  selector: 'app-pregunta-rapidas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntas-rapidas.component.html',
  styleUrl: './preguntas-rapidas.component.css',
})
export class PreguntaRapidasComponent implements OnChanges, OnDestroy {
  @Input() pregunta: any = null;
  @Input() numeroPregunta: number = 1;
  @Output() siguiente = new EventEmitter<{ acierto: boolean; tiempo: number }>();

  opcionesMezcladas: string[] = [];
  tiempoRestante: number = 4;
  tiempoTotal: number = 4;
  intervalo: any;
  puntosGanados: number = 0;
  mostrarPuntos: boolean = false;

  respuestaSeleccionada: string | null = null;

  constructor(public puntuacion: PuntuacionService) { }

  /**
   * Se ejecuta cuando llega una nueva pregunta (Input cambia).
   * Prepara todo: mezcla opciones, calcula timer random, arranca countdown.
   */
  ngOnChanges() {
    if (this.pregunta) {
      this.prepararPregunta();
    }
  }

  /**
   * Reinicia la pregunta: mezcla opciones, genera tiempo random 4-8s,
   * limpia estados y arranca el temporizador.
   */
  prepararPregunta() {
    clearInterval(this.intervalo);
    this.opcionesMezcladas = [...this.pregunta.opciones].sort(() => Math.random() - 0.5);

    // Tiempo aleatorio 5-8 segundos
    this.tiempoTotal = Math.floor(Math.random() * (7 - 4 + 1)) + 4;
    this.tiempoRestante = this.tiempoTotal;

    this.mostrarPuntos = false;
    this.puntosGanados = 0;
    this.respuestaSeleccionada = null;

    this.iniciarTemporizador();
  }

  /**
   * Inicia el countdown: baja tiempoRestante cada segundo.
   * Si llega a 0: penaliza -30 puntos, cuenta como fallo y emite siguiente.
   */
  iniciarTemporizador() {
    this.intervalo = setInterval(() => {
      this.tiempoRestante--;

      if (this.tiempoRestante <= 0) {
        clearInterval(this.intervalo);

        this.respuestaSeleccionada = null;
        this.puntosGanados = -30;
        this.puntuacion.puntosTotales -= 30;
        this.puntuacion.incorrectas++;
        this.mostrarPuntos = true;

        setTimeout(() => {
          this.siguiente.emit({ acierto: false, tiempo: this.tiempoTotal });
        }, 800);
      }
    }, 1000);
  }

  /**
   * Procesa la respuesta del usuario.
   * Calcula puntos (+70 si muy rápido, +30 si normal, -15 si falla).
   * Muestra feedback y emite al padre tras un pequeño delay para ver animación.
   * @param opcion La opción elegida por el usuario
   */
  responder(opcion: string) {
    clearInterval(this.intervalo);

    this.respuestaSeleccionada = opcion;

    let acierto = false;
    if (opcion === this.pregunta.correcta) {
      const puntos = this.tiempoRestante >= 3 ? 70 : 30;
      this.puntosGanados = puntos;
      this.puntuacion.puntosTotales += puntos;
      this.puntuacion.correctas++;
      acierto = true;
    } else {
      this.puntosGanados = -15;
      this.puntuacion.puntosTotales -= 15;
      this.puntuacion.incorrectas++;
    }

    this.mostrarPuntos = true;

    setTimeout(() => {
      const tiempoUsado = this.tiempoTotal - this.tiempoRestante;
      this.siguiente.emit({ acierto, tiempo: tiempoUsado });
    }, 800);
  }

  /**
   * Limpia el intervalo al destruir el componente (no deja timers zombies).
   */
  ngOnDestroy() {
    clearInterval(this.intervalo);
  }
}
