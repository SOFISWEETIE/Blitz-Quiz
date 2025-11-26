import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SeleccionService } from '../../servicios/seleccion.service';

@Component({
  selector: 'app-dificultad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dificultad.component.html',
  styleUrls: ['./dificultad.component.css']  
})
export class DificultadComponent {
  dificultades = ['Facil', 'Media', 'Dificil'];

  constructor(
    private router: Router,
    public seleccion: SeleccionService
  ) {}

  elegirDificultad(dif: string) {
    // Guardamos la dificultad
    this.seleccion.establecerDificultad(dif);
    console.log('Dificultad elegida:', this.seleccion.dificultad);

    // Navegación segura a /juego
    this.router.navigate(['/juego'])
      .then(success => {
        if (!success) {
          console.error('No se pudo navegar a /juego');
        }
      });
  }
}
