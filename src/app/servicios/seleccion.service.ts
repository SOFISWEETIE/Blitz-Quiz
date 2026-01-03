import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
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
    const categorias = ['Arte','Ciencia','Deporte','Cine','Geografia','Historia'];
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
}