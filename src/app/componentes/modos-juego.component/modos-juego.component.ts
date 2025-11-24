import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SeleccionService } from '../../servicios/seleccion.service';

@Component({
  selector: 'app-modos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modos-juego.component.html',
styleUrl: './modos-juego.component.css'
})
export class ModosJuegoComponent {
  constructor(private router: Router, public seleccion: SeleccionService) {}

  elegirClasico() {
    this.seleccion.modo = 'clasico';
    this.router.navigate(['/categoria']);
  }

  elegirAleatorio() {
    this.seleccion.modo = 'aleatorio';
    this.router.navigate(['/juego']);
  }
}
