import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SeleccionService {
  modo: 'clasico' | 'aleatorio' | 'rapidas' = 'clasico';

  categoria: string = '';
  dificultad: string = '';
  vidas: number = 3;

  establecerModo(modo: 'clasico' | 'aleatorio' | 'rapidas') {
    this.modo = modo;
  }

  establecerCategoria(cat: string) {
    this.categoria = cat;
  }

  establecerDificultad(dif: string) {
    this.dificultad = dif;
  }

  establecerVidas(v: number) {
    this.vidas = v;
  }

  perderVida() {
    this.vidas--;
  }

  reiniciarVidas() {
    this.vidas = 3;
  }

  establecerCategoriaAleatoria(): string {
    const categorias = ['Arte', 'Ciencia', 'Deporte', 'Cine', 'Geografia', 'Historia'];
    const cat = categorias[Math.floor(Math.random() * categorias.length)];
    this.categoria = cat;
    return cat;
  }

  establecerDificultadAleatoria(): string {
    const dificultades = ['facil', 'media', 'dificil'];
    const dif = dificultades[Math.floor(Math.random() * dificultades.length)];
    this.dificultad = dif;
    return dif;
  }

  resetSeleccion() {
    this.modo = 'clasico';
    this.categoria = '';
    this.dificultad = '';
    this.reiniciarVidas();
  }

  prepararNuevaPartida() {
    switch (this.modo) {
      case 'clasico':
        // Mantiene la categoria y dificultad seleccionada anteriormente por el usuario
        this.reiniciarVidas();
        break;
      case 'aleatorio':
        // Al seleccionar el modo aleatorio, todo cambia tanto la categoria como la dificultad
        this.establecerCategoriaAleatoria();
        this.establecerDificultadAleatoria();
        this.reiniciarVidas();
        break;
      case 'rapidas':
        // Se mantiene todo aleatorio
        this.establecerCategoriaAleatoria();
        this.establecerDificultadAleatoria();
        this.reiniciarVidas();
        break;
    }
  }
}
