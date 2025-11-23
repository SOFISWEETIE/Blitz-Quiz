import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeleccionService } from '../../servicios/seleccion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categoria.component.html'
})
export class CategoriaComponent {
  categorias = ['Arte', 'Ciencia', 'Deporte', 'Cine y TV', 'Geografia', 'Historia', 'Musica'];

  constructor(private seleccion: SeleccionService, private router: Router) {}

  elegir(categoria: string) {
    this.seleccion.establecerCategoria(categoria);
    this.router.navigate(['/dificultad']);
  }
}