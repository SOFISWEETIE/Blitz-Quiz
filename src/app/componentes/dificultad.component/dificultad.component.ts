import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SeleccionService } from '../../servicios/seleccion.service';


/**
 * Componente que muestra la selección de dificultad para las preguntas.
 * El usuario elige entre Fácil, Medio o Difícil y se navega al juego.
 */
@Component({
  selector: 'app-dificultad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dificultad.component.html',
  styleUrl: './dificultad.component.css'
})
export class DificultadComponent {

  /**
   * Array estático con las dificultades disponibles.
   * Se muestran como tarjetas clicables en la vista y se usan para generar clases dinámicas.
   */
  dificultades = ['Facil','Media','Dificil'];
  
  /**
   * Constructor del componente.
   * Inyecta el Router para navegación y el servicio de selección para mantener el estado global.
   * @param router Servicio de Angular para manejar la navegación entre rutas
   * @param seleccion Servicio compartido que almacena categoría y dificultad elegidas por el usuario
   */
  constructor(private router: Router, 
    public seleccion: SeleccionService
  ) {}

  /**
   * Método ejecutado al hacer clic en una tarjeta de dificultad.
   * Guarda la dificultad seleccionada en el servicio compartido y navega al componente del juego.
   * @param dif Nombre de la dificultad seleccionada (Facil, Media o Dificil)
   */
  elegirDificultad(dif: string) {
    this.seleccion.establecerDificultad(dif);
    this.router.navigate(['/app/juego']);
  }
}
