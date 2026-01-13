import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogrosService } from '../../servicios/logros.service';
import { LOGROS_DEF } from './logros.def';
import { Router } from '@angular/router';

/**
 * Componente que muestra los logros desbloqueados por el usuario.
 * Carga el estado de logros desde el servicio, filtra por niveles (bronce, plata, oro, diamante)
 * y permite navegar de vuelta a la pantalla de modos.
 */
@Component({
  selector: 'app-logros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logros.component.html',
  styleUrls: ['./logros.component.css']
})
export class LogrosComponent implements OnInit {

  /**
   * Inyección del servicio de logros usando inject() (estilo moderno Angular 14+).
   * Maneja la lógica de obtención y actualización de logros del usuario.
   */
  private logrosService = inject(LogrosService);

  /**
   * Array estático con la definición completa de todos los logros de la app.
   * Importado desde logros.def.ts para mantener la configuración separada y reusable.
   */  
  logros = LOGROS_DEF;

  /**
   * Objeto que almacena el estado de desbloqueo de cada logro.
   * Clave: ID del logro (string) → Valor: true si desbloqueado, false/undefined si no.
   */  
  estado: Record<string, boolean> = {};

  /**
   * Inyección del Router para manejar la navegación interna.
   * @param router Servicio de Angular para redirigir al usuario
   */
  constructor(private router: Router) {}

  async ngOnInit() {
    this.estado = await this.logrosService.obtenerLogros();
  }

  /**
   * Comprueba si un logro específico está desbloqueado para el usuario actual.
   * 
   * @param id Identificador único del logro (ej: 'primer-partida', '10-victorias')
   * @returns boolean - true si el logro está desbloqueado, false en caso contrario
   */
  desbloqueado(id: string) {
    return !!this.estado[id];
  }

  /**
   * Filtra la lista de logros según su nivel (bronce, plata, oro, diamante).
   * Útil para mostrar secciones separadas en la vista por dificultad/recompensa.
   * 
   * @param nivel Nivel del logro a filtrar (ej: 'bronce', 'plata')
   * @returns Array de logros que coinciden con el nivel especificado
   */
  getLogrosPorNivel(nivel: string) {
  return this.logros.filter(l => l.nivel === nivel);
  }

  /**
   * Navega de vuelta a la pantalla de selección de modos de juego.
   * Usado en el botón "Volver atrás" o similar.
   */
  volverAtras() {
  this.router.navigate(['/app/modos']);
  }
}
