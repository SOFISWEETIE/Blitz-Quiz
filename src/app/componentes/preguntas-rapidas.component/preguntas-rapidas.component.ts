import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuntuacionService } from '../../servicios/puntuacion.service';

@Component({
  selector: 'app-pregunta-rapidas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntas-rapidas.component.html',
  styleUrl: './preguntas-rapidas.component.css'
})
export class PreguntaRapidasComponent implements OnChanges, OnDestroy {
  @Input() pregunta: any = null;
  @Input() numeroPregunta: number = 1;

  @Output() siguiente = new EventEmitter<void>();
  

  opcionesMezcladas: string[] = [];
  tiempoRestante: number = 4;
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
    this.tiempoRestante = 4;
    this.mostrarPuntos = false;
    this.iniciarTemporizador();
  }

  iniciarTemporizador() {
    this.intervalo = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        this.puntuacion.sumarIncorrecta();
        clearInterval(this.intervalo);
      }
    }, 1000);
  }

  responder(opcion: string) {
  clearInterval(this.intervalo);

  if (opcion === this.pregunta.correcta) {
    // ¡ACERTÓ!
    const puntos = this.tiempoRestante >= 3 ? 50 : 35;
    this.puntosGanados = puntos;
    this.mostrarPuntos = true;
    this.puntuacion.puntosTotales += puntos;
    this.puntuacion.correctas++;
  } else {
    // ¡FALLÓ! → No pasa nada, solo 0 puntos
    this.puntuacion.incorrectas++;
    this.puntosGanados = 0;
    this.mostrarPuntos = true; // opcional: mostrar "+0" o nada
  }

  // SIEMPRE pasa a la siguiente (¡nunca game over!)
  setTimeout(() => {
    this.siguiente.emit();
  }, 800);
}

  ngOnDestroy() {
    clearInterval(this.intervalo);
  }
}