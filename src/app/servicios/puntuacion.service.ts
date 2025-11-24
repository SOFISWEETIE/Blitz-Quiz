import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PuntuacionService {
  correctas: number = 0;
  incorrectas: number = 0;
  totalPreguntas: number = 0;
  preguntasActuales: any[] = [];
  indice: number = 0;

  reiniciar() {
    this.correctas = 0;
    this.incorrectas = 0;
    this.totalPreguntas = 0;
    this.preguntasActuales = [];
    this.indice = 0;
  }

  establecerTotal(total: number) {
    this.totalPreguntas = total;
  }

  sumarCorrecta() {
    this.correctas++;
  }

  sumarIncorrecta() {
    this.incorrectas++;
  }
}
