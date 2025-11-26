import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuntuacionService } from '../../servicios/puntuacion.service';

@Component({
  selector: 'app-pregunta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pregunta.component.html',
  styleUrls: ['./pregunta.component.css'] 
})
export class PreguntaComponent implements OnChanges, OnDestroy {
  @Input() pregunta: any = null;

  @Output() siguiente = new EventEmitter<void>();

  opcionesMezcladas: string[] = [];
  tiempoRestante: number = 20;
  intervalo: any;
  puntosGanados: number = 0;
  mostrarPuntos: boolean = false;

  constructor(public puntuacion: PuntuacionService) {}

  ngOnChanges() {
    if (this.pregunta) {
      this.prepararPregunta();
    }
  }

  prepararPregunta() {
    clearInterval(this.intervalo);
    this.opcionesMezcladas = [...this.pregunta.opciones].sort(() => Math.random() - 0.5);
    this.tiempoRestante = 20;
    this.mostrarPuntos = false;
    this.puntosGanados = 0;
    this.iniciarTemporizador();
  }

  iniciarTemporizador() {
    this.intervalo = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        this.responder(null); // Se acabó el tiempo
      }
    }, 1000);
  }

  responder(opcion: string | null) {
    clearInterval(this.intervalo);

    if (opcion === this.pregunta.correcta) {
      // ¡ACERTÓ! → +100 si responde en los primeros 10 segundos, +50 después
      const puntos = this.tiempoRestante >= 10 ? 100 : 50;
      this.puntosGanados = puntos;
      this.mostrarPuntos = true;
      this.puntuacion.puntosTotales += puntos;
      this.puntuacion.correctas++;
    } else {
      // ¡FALLÓ O SE ACABÓ EL TIEMPO!
      this.puntosGanados = 0;
      this.mostrarPuntos = true;
      this.puntuacion.incorrectas++;
    }

    // Puntos desaparecen después de 1 segundo
    setTimeout(() => {
      this.mostrarPuntos = false;
    }, 1000);

    // Pasar a la siguiente pregunta
    setTimeout(() => {
      this.siguiente.emit();
    }, 1100);
  }

  ngOnDestroy() {
    clearInterval(this.intervalo);
  }

  // Para el contador
  get numeroPregunta() {
    return this.puntuacion.indice + 1;
  }

  get totalPreguntas() {
    return this.puntuacion.totalPreguntas;
  }
}