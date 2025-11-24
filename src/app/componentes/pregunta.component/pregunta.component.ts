import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuntuacionService } from '../../servicios/puntuacion.service';

@Component({
  selector: 'app-pregunta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pregunta.component.html',
  styleUrl: './pregunta.component.css'
})
export class PreguntaComponent implements OnChanges {
  @Input() pregunta: any;
  @Output() siguiente = new EventEmitter<void>();

  opcionesMezcladas: string[] = [];
  tiempoRestante: number = 20;
  intervalo: any;

  constructor(public puntuacion: PuntuacionService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pregunta'] && changes['pregunta'].currentValue) {
      this.prepararPregunta();
    }
  }

  prepararPregunta() {
    clearInterval(this.intervalo);
    this.opcionesMezcladas = [...this.pregunta.opciones].sort(() => Math.random() - 0.5);
    this.tiempoRestante = 20;
    this.iniciarTemporizador();
  }

  iniciarTemporizador() {
    this.intervalo = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante === 0) {
        this.responder(null);
      }
    }, 1000);
  }

  responder(opcion: string | null) {
    clearInterval(this.intervalo);

    if (opcion === this.pregunta.correcta) {
      this.puntuacion.sumarCorrecta();
    } else {
      this.puntuacion.sumarIncorrecta();
    }

    setTimeout(() => this.siguiente.emit(), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalo);
  }
}
