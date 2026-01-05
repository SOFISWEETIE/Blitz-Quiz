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
  rachaActual: number = 0;
  partidasJugadas: number = 0; 
  modosJugados: Set<string> = new Set(); 
  blitzConsecutivas: number = 0

  reiniciar() {
    this.correctas = 0;
    this.incorrectas = 0;
    this.totalPreguntas = 0;
    this.preguntasActuales = [];
    this.indice = 0;
    this.puntosTotales = 0; // se reinician los puntos
    this.rachaActual = 0;
    this.modosJugados = new Set();
    this.blitzConsecutivas = 0
  }

  establecerTotal(total: number) {
    this.totalPreguntas = total;
  }

  
  sumarCorrecta() {
    this.correctas++;
    this.puntosTotales += 100;  
    this.rachaActual++;
  }

  sumarIncorrecta() {
    this.incorrectas++;
    this.rachaActual = 0;
    
  }
  
  resetPuntuacion() {
  this.puntosTotales = 0;
  this.correctas = 0;
  this.incorrectas = 0;
  this.totalPreguntas = 0;
  }


  sumarCorrectaRapida(tiempoRestante: number) {
    this.correctas++;
    this.rachaActual++;

    let puntos = 0;
    if (tiempoRestante >= 3) {
      puntos = 50;   // Respondió en los primeros 2 segundos (4 o 3)
    } else if (tiempoRestante >= 1) {
      puntos = 35;   // Respondió en los últimos 2 segundos (2 o 1)
    }
    // Si responde en 0 → ya es fallo por tiempo, no llega aquí

    this.puntosTotales += puntos;
    return puntos;  
    
  }

  sumarIncorrectaRapida() {
  this.incorrectas++;
  this.rachaActual = 0;
  }

  incrementarPartidasJugadas() {
  this.partidasJugadas++;
  }

  añadirModoJugado(modo: string) {
  this.modosJugados.add(modo);
  }
}
