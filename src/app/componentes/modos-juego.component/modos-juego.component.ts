import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SeleccionService } from '../../servicios/seleccion.service';
import { PreguntasService } from '../../servicios/preguntas.service';

@Component({
  selector: 'app-modos-juego',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modos-juego.component.html',
  styleUrls: ['./modos-juego.component.css']
})
export class ModosJuegoComponent {

  constructor(
    private router: Router,
    private seleccion: SeleccionService,
    private preguntasService: PreguntasService
  ) {}

  elegirModo(modo: 'clasico' | 'aleatorio' | 'supervivencia') {
  this.seleccion.establecerModo(modo);
  this.seleccion.reiniciarVidas();

  if (modo === 'aleatorio') {
    // ALEATORIO: elige categoría + dificultad random y VA DIRECTO AL JUEGO
    const categorias = ['Arte', 'Ciencia', 'Deporte', 'Entretenimiento', 'Geografia', 'Historia'];
    const dificultades = ['facil', 'media', 'dificil'];

    const catRandom = categorias[Math.floor(Math.random() * categorias.length)];
    const difRandom = dificultades[Math.floor(Math.random() * dificultades.length)];

    this.seleccion.establecerCategoria(catRandom);
    this.seleccion.establecerDificultad(difRandom);

   // va directo al juego no escoge nada
    this.router.navigate(['/juego']);
  }

  else if (modo === 'clasico') {
    //calsico 
    this.router.navigate(['/categoria']);
    }
  }
}
