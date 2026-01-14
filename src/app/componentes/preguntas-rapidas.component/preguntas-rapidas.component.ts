import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuntuacionService } from '../../servicios/puntuacion.service';

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

  ngOnChanges() {
    if (this.pregunta) {
      this.prepararPregunta();
    }
  }

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

  ngOnDestroy() {
    clearInterval(this.intervalo);
  }
}
