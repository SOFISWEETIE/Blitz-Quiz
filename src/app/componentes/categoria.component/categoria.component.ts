import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SeleccionService } from '../../servicios/seleccion.service';


/**
 * Componente que muestra la selección de categoría en la aplicación.
 * Permite al usuario elegir una categoría de preguntas y pasa a la pantalla de dificultad.
 */
@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent {

  /**
   * Array estático con las categorías disponibles en la aplicación.
   * Estas categorías se muestran como tarjetas clicables en la vista.
   */
  categorias = ['Arte', 'Ciencia', 'Deporte', 'Cine', 'Geografia', 'Historia'];

  /**
   * Constructor del componente.
   * @param router Servicio de Angular para la navegación entre rutas
   * @param seleccion Servicio compartido que almacena la categoría y dificultad seleccionadas
   */
  constructor(private router: Router, public seleccion: SeleccionService) { }

  /**
   * Método llamado al hacer clic en una tarjeta de categoría.
   * Guarda la categoría seleccionada en el servicio compartido y navega a la pantalla de dificultad.
   * @param cat Nombre de la categoría seleccionada por el usuario
   */
  elegirCategoria(cat: string) {
    this.seleccion.establecerCategoria(cat);
    this.router.navigate(['/app/dificultad']);
  }
}
