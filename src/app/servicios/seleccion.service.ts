import { Injectable } from '@angular/core';

/**
 * Servicio que guarda y gestiona la selección actual del usuario:
 * modo de juego, categoría, dificultad y vidas.
 * Se usa para pasar datos entre pantallas (categoría → dificultad → juego).
 */
@Injectable({
  providedIn: 'root'
})
export class SeleccionService {
  modo: 'clasico' | 'aleatorio' | 'rapidas' = 'clasico';
  categoria: string = '';
  dificultad: string = '';
  vidas: number = 3;

  /** Establece el modo de juego actual */
  establecerModo(modo: 'clasico' | 'aleatorio' | 'rapidas') {
    this.modo = modo;
  }

  /** Guarda la categoría elegida */
  establecerCategoria(cat: string) {
    this.categoria = cat;
  }

  /** Guarda la dificultad elegida */
  establecerDificultad(dif: string) {
    this.dificultad = dif;
  }

  /** Establece número de vidas (por si algún modo lo necesita) */
  establecerVidas(v: number) {
    this.vidas = v;
  }

  /** Resta una vida (para modos con vidas limitadas) */
  perderVida() {
    this.vidas--;
  }

  /** Reinicia vidas a 3 (por defecto) */
  reiniciarVidas() {
    this.vidas = 3;
  }

  /** Elige una categoría random de la lista fija y la guarda */
  establecerCategoriaAleatoria(): string {
    const categorias = ['Arte', 'Ciencia', 'Deporte', 'Cine', 'Geografia', 'Historia'];
    const cat = categorias[Math.floor(Math.random() * categorias.length)];
    this.categoria = cat;
    return cat;
  }

  /** Elige una dificultad random y la guarda */
  establecerDificultadAleatoria(): string {
    const dificultades = ['facil', 'media', 'dificil'];
    const dif = dificultades[Math.floor(Math.random() * dificultades.length)];
    this.dificultad = dif;
    return dif;
  }

  /**
   * Resetea todo a valores por defecto (modo clásico, sin cat/dif, vidas 3).
   * Útil al cerrar sesión o empezar de cero.
   */
  resetSeleccion() {
    this.modo = 'clasico';
    this.categoria = '';
    this.dificultad = '';
    this.reiniciarVidas();
  }

  /**
   * Prepara una nueva partida según el modo actual:
   * - Clásico: mantiene cat/dif elegidas, solo reinicia vidas
   * - Aleatorio/Rápidas: elige cat y dif random, reinicia vidas
   */
  prepararNuevaPartida() {
    switch (this.modo) {
      case 'clasico':
        this.reiniciarVidas();
        break;
      case 'aleatorio':
        this.establecerCategoriaAleatoria();
        this.establecerDificultadAleatoria();
        this.reiniciarVidas();
        break;
      case 'rapidas':
        this.establecerCategoriaAleatoria();
        this.establecerDificultadAleatoria();
        this.reiniciarVidas();
        break;
    }
  }
}