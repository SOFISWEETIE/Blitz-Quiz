import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogrosService } from '../../servicios/logros.service';
import { LOGROS_DEF } from './logros.def';
import { Router } from '@angular/router';

/* Componente responsable de la gestión y visualización de los logros del usuario */
@Component({
  selector: 'app-logros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logros.component.html',
  styleUrls: ['./logros.component.css']
})
export class LogrosComponent implements OnInit {

  /* Inyección del servicio encargado de la gestión de logros */
  private logrosService = inject(LogrosService);

  /* Definición de todos los logros disponibles en la aplicación */
  logros = LOGROS_DEF;

  /* Registro del estado de desbloqueo de cada logro true = desbloqueado */
  estado: Record<string, boolean> = {};

  /* Inyección del enrutador para navegación interna */
  constructor(private router: Router) {}

  /* Inicialización del componente y carga del estado de logros del usuario */
  async ngOnInit() {
    this.estado = await this.logrosService.obtenerLogros();
  }

  /* Determina si un logro específico está desbloqueado */
  desbloqueado(id: string) {
    return !!this.estado[id];
  }

  /* Filtra los logros según su nivel bronce, plata, oro, diamante */
  getLogrosPorNivel(nivel: string) {
  return this.logros.filter(l => l.nivel === nivel);
  }

  /* Navega a la página de modos al pulsar volver atrás */
  volverAtras() {
  this.router.navigate(['/app/modos']);
  }
}
