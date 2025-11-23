import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PuntuacionService {
  aciertos: number = 0;
  totalPreguntas: number = 0;

  
  preguntasActuales: any[] = [];
  indice: number = 0;

  reiniciar() {
    this.aciertos = 0;
    this.totalPreguntas = 0;
    this.preguntasActuales = [];
    this.indice = 0;
  }

  sumarAcierto() {
    this.aciertos++;
  }
  sumarFallo() {
    
  }

  establecerTotal(total: number) {
    this.totalPreguntas = total;
  }
}