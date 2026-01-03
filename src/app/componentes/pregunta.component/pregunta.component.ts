import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuntuacionService } from '../../servicios/puntuacion.service';
import { SeleccionService } from '../../servicios/seleccion.service';

@Component({
  selector: 'app-pregunta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pregunta.component.html',
  styleUrl: './pregunta.component.css'
})
export class PreguntaComponent implements OnChanges, OnDestroy {
  @Input() pregunta: any = null;

  @Output() siguiente = new EventEmitter<{ acierto: boolean; tiempo: number }>();

  opcionesMezcladas: string[] = [];
  tiempoRestante: number = 20;
  intervalo: any;
  puntosGanados: number = 0;
  mostrarPuntos: boolean = false;
  tiempoInicio!: number;
  respuestaSeleccionada: string | null = null;
  bloquearOpciones: boolean = false;

  constructor(public puntuacion: PuntuacionService, public seleccion: SeleccionService) {}

  ngOnChanges() {
    if (this.pregunta) {
      this.prepararPregunta();
    }
  }

  prepararPregunta() {
    clearInterval(this.intervalo);
    this.opcionesMezcladas = [...this.pregunta.opciones].sort(() => Math.random() - 0.5);
    this.mostrarPuntos = false;
    this.puntosGanados = 0;

    this.tiempoInicio = Date.now();

    if (this.seleccion.modo === 'aleatorio') {
      this.tiempoRestante = this.tiempoAleatorio();
    } else {
      this.tiempoRestante = 20;
    }
    
    this.iniciarTemporizador();
  }

  tiempoAleatorio(): number {
    return Math.floor(Math.random() * (20 - 8 + 1)) + 8;
  }

  iniciarTemporizador() {
    this.intervalo = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        this.responder(null);
      }
    }, 1000);
  }

  responder(opcion: string | null) {
    if (this.bloquearOpciones) return;

    this.respuestaSeleccionada = opcion;
    this.bloquearOpciones = true;

    const tiempoRespuesta = (Date.now() - this.tiempoInicio) / 1000;
    console.log('Tiempo de respuesta:', tiempoRespuesta.toFixed(2), 's');

    let acierto = false;

    if (opcion === this.pregunta.correcta) {
      acierto = true;
      let puntos = 0;

      if (this.seleccion.modo === 'clasico') {
        
        const dif = this.seleccion.dificultad.toLowerCase();

        switch (dif) {
          case 'facil':
            puntos = 5;
            break;
          case 'media':
            puntos = 10;  
            break;
          case 'dificil':
            puntos = 15;
            break;
          default:
            console.warn('Dificultad desconocida:', this.seleccion.dificultad);
            puntos = 5; 
        }
      } else if (this.seleccion.modo === 'aleatorio') {
        puntos = this.tiempoRestante >= 10 ? 25 : 20;
        this.puntuacion.sumarCorrecta();
      }

      this.puntuacion.puntosTotales += puntos;
      this.puntuacion.correctas++;
      this.puntosGanados = puntos;
      this.mostrarPuntos = true;

    } else {
      this.puntosGanados = 0;
      this.mostrarPuntos = true;
      this.puntuacion.incorrectas++;
    }

    setTimeout(() => {
      this.mostrarPuntos = false;
    }, 1000);

    setTimeout(() => {
      this.siguiente.emit({ acierto, tiempo: tiempoRespuesta });
      this.bloquearOpciones = false;
      this.respuestaSeleccionada = null;
    }, 1100);
  }

  ngOnDestroy() {
    clearInterval(this.intervalo);
  }

  get numeroPregunta() {
    return this.puntuacion.indice + 1;
  }

  get totalPreguntas() {
    return this.puntuacion.totalPreguntas;
  }
}