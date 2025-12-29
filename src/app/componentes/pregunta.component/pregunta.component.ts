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

    // tiempo aleatorio pero solo en este modo
    if (this.seleccion.modo === 'aleatorio') {
      this.tiempoRestante = this.tiempoAleatorio();
    } else {
      // modo clásico se mantiene el mismo tiempo
      this.tiempoRestante = 20;
    }
    
    this.iniciarTemporizador();
  }

  // Genera un tiempo aleatorio entre 8 y 20 segundos
  tiempoAleatorio(): number {
    return Math.floor(Math.random() * (20 - 8 + 1)) + 8;
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

  const tiempoRespuesta = (Date.now() - this.tiempoInicio) / 1000;
  console.log('Tiempo de respuesta:', tiempoRespuesta.toFixed(2), 's'); // depuración

  let acierto = false;

  if (opcion === this.pregunta.correcta) {
    acierto = true;

    if (this.seleccion.modo === 'aleatorio') {
      
      this.puntuacion.sumarCorrecta();
      this.puntosGanados = 100;
    } else {
      // Modo clásico puede variar la puntuación
      const puntos = this.tiempoRestante >= 10 ? 100 : 50;
      this.puntuacion.puntosTotales += puntos;
      this.puntuacion.correctas++;
      this.puntosGanados = puntos;
    }

    this.mostrarPuntos = true;
  } else {
    // INCORRECTA
    this.puntosGanados = 0;
    this.mostrarPuntos = true;
    this.puntuacion.incorrectas++;
  }

    // Puntos desaparecen después de 1 segundo
    setTimeout(() => {
      this.mostrarPuntos = false;
    }, 1000);

    // Verificar si fue correcto o incorrecto
    setTimeout(() => {
      this.siguiente.emit({ acierto, tiempo: tiempoRespuesta }); 
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
