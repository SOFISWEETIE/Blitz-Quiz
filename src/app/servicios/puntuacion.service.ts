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
  puntosTotales: number = 0;

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

  // MÉTODO CLÁSICO (lo mantienes para los modos normales)
  sumarCorrecta() {
    this.correctas++;
    this.puntosTotales += 100;  // o lo que tengas ahora
  }

  sumarIncorrecta() {
    this.incorrectas++;
    // Sin puntos negativos por ahora (tú mandas)
  }

  // ==================== MÉTODOS NUEVOS PARA PREGUNTAS RÁPIDAS ====================

  
  sumarCorrectaRapida(tiempoRestante: number) {
    this.correctas++;

    let puntos = 0;
    if (tiempoRestante >= 3) {
      puntos = 50;   // Respondió en los primeros 2 segundos (4 o 3)
    } else if (tiempoRestante >= 1) {
      puntos = 35;   // Respondió en los últimos 2 segundos (2 o 1)
    }
    // Si responde en 0 → ya es fallo por tiempo, no llega aquí

    this.puntosTotales += puntos;
    return puntos;  // Devuelve los puntos ganados para animaciones chulas
  }

  sumarIncorrectaRapida() {
  this.incorrectas++;
  }

  
}