import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SeleccionService } from '../../servicios/seleccion.service';

@Component({
  selector: 'app-dificultad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dificultad.component.html',
  styleUrl: './dificultad.component.css'
})
export class DificultadComponent {
  dificultades = ['Facil','Media','Dificil'];

  constructor(private router: Router, public seleccion: SeleccionService) {}

  elegirDificultad(dif: string) {
    this.seleccion.establecerDificultad(dif);
    this.router.navigate(['/juego']);
  }
}
