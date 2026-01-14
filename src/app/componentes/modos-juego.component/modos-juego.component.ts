import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SeleccionService } from '../../servicios/seleccion.service';

/* 
* Componente responsable de la selección del modo de juego
* Permite al usuario elegir entre los modos Clásico, Aleatorio y Blitz Rápidas,
* almacenando la selección en el servicio de estado y redirigiendo a la vista correspondiente
*/
@Component({
  selector: 'app-modos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modos-juego.component.html',
  styleUrl: './modos-juego.component.css'
})
export class ModosJuegoComponent {

  /* 
  * Constructor del componente
  * Inyecta el servicio de enrutamiento para la navegación
  * y el servicio de selección para almacenar el modo elegido
  */
  constructor(private router: Router, public seleccion: SeleccionService) { }

  /* Selecciona el modo Clásico. El usuario podrá elegir categoría y dificultad antes de iniciar la partida */
  elegirClasico() {
    this.seleccion.modo = 'clasico';
    this.router.navigate(['app/categoria']);
  }

  /* Selecciona el modo Aleatorio. La categoría y la dificultad se determinan automáticamente */
  elegirAleatorio() {
    this.seleccion.modo = 'aleatorio';
    this.router.navigate(['app/juego']);
  }

  /* Selecciona el modo Blitz Rápidas. Se activa un modo de juego con preguntas y tiempos aleatorios */
  elegirRapidas() {
    this.seleccion.establecerModo('rapidas');
    this.router.navigate(['app/juego']);
  }
}
