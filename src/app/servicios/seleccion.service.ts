import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SeleccionService {
  modo: 'clasico' | 'aleatorio' | 'supervivencia' = 'clasico';
  categoria: string = '';
  dificultad: string = '';
  vidas: number = 3;

  establecerModo(modo: 'clasico' | 'aleatorio' | 'supervivencia') {
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
  
}