import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogrosService } from '../../servicios/logros.service';
import { LOGROS_DEF } from './logros.def';

@Component({
  selector: 'app-logros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logros.component.html',
  styleUrls: ['./logros.component.css']
})
export class LogrosComponent implements OnInit {

  private logrosService = inject(LogrosService);

  logros = LOGROS_DEF;
  estado: Record<string, boolean> = {};

  async ngOnInit() {
    this.estado = await this.logrosService.obtenerLogros();
  }

  desbloqueado(id: string) {
    return !!this.estado[id];
  }

  getLogrosPorNivel(nivel: string) {
  return this.logros.filter(l => l.nivel === nivel);
  }
}
