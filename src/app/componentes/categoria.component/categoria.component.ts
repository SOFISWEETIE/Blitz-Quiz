import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SeleccionService } from '../../servicios/seleccion.service';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent {
  categorias = ['Arte','Ciencia','Deporte','Cine','Geografia','Historia','Musica','Tecnologia'];

  constructor(private router: Router, public seleccion: SeleccionService) {}

  elegirCategoria(cat: string) {
    this.seleccion.establecerCategoria(cat);
    this.router.navigate(['/dificultad']);
  }
}
