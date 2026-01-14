import { Injectable } from '@angular/core';

/**
 * Servicio que gestiona toda la puntuación y estadísticas de la partida actual.
 * Lleva cuenta de aciertos/fallos, puntos, racha, total preguntas, modos jugados...
 * Se reinicia al empezar nueva partida y se usa en todos los modos (clásico, aleatorio, rápidas).
 */
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

  /**
     * Reinicia todas las estadísticas para empezar una nueva partida limpia.
     * Se llama al iniciar juego o al pulsar "Jugar otra vez".
     */
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

  /**
   * Establece el número total de preguntas de esta partida.
   * @param total Número de preguntas que se van a jugar
   */
  establecerTotal(total: number) {
    this.totalPreguntas = total;
  }

  /**
   * Suma una respuesta correcta (modo clásico/aleatorio).
   * Añade 100 puntos fijos y sube la racha actual.
   */
  sumarCorrecta() {
    this.correctas++;
    this.puntosTotales += 100;
    this.rachaActual++;
  }

  /**
   * Suma una respuesta incorrecta (modo clásico/aleatorio).
   * Resetea la racha a 0.
   */
  sumarIncorrecta() {
    this.incorrectas++;
    this.rachaActual = 0;

  }

  /**
   * Reinicia solo la puntuación y contadores básicos (correctas, incorrectas, puntos, total).
   * Útil para limpiar después de una partida sin tocar stats globales como partidasJugadas.
   */
  resetPuntuacion() {
    this.puntosTotales = 0;
    this.correctas = 0;
    this.incorrectas = 0;
    this.totalPreguntas = 0;
  }

  /**
   * Suma respuesta correcta en modo rápidas (BLITZ).
   * Puntos dependen del tiempo restante: 50 si ≥3s, 35 si 1-2s.
   * Sube racha y devuelve puntos para mostrar en pantalla.
   * @param tiempoRestante Segundos que quedaban cuando respondió
   * @returns Puntos ganados en esta pregunta
   */
  sumarCorrectaRapida(tiempoRestante: number) {
    this.correctas++;
    this.rachaActual++;

    let puntos = 0;
    if (tiempoRestante >= 3) {
      puntos = 50;   
    } else if (tiempoRestante >= 1) {
      puntos = 35;   
    }
    

    this.puntosTotales += puntos;
    return puntos;

  }

  /**
   * Suma respuesta incorrecta en modo rápidas.
   * Resetea racha (no penaliza puntos extra aquí, solo cuenta fallo).
   */
  sumarIncorrectaRapida() {
    this.incorrectas++;
    this.rachaActual = 0;
  }

  /**
   * Incrementa el contador global de partidas jugadas (para logros como "partidasDiez").
   */
  incrementarPartidasJugadas() {
    this.partidasJugadas++;
  }

  /**
   * Añade el modo actual a los modos jugados (para logro "multiModo").
   * Usa Set para no repetir.
   * @param modo Nombre del modo ('clasico', 'aleatorio', 'rapidas'...)
   */
  añadirModoJugado(modo: string) {
    this.modosJugados.add(modo);
  }
}
