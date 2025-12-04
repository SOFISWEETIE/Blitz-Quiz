import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeleccionService } from '../../servicios/seleccion.service';
import { PuntuacionService } from '../../servicios/puntuacion.service';
import { Router } from '@angular/router';
import { ServicioRanking } from '../../servicios/ranking.service';
import { AuthService } from '../../servicios/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css'] 
})
export class ResultadosComponent {
  constructor(
    public seleccion: SeleccionService,
    public puntuacion: PuntuacionService,
    private router: Router,
    private servicioRanking: ServicioRanking,
    private auth: AuthService
  ) {}

  async ngOnInit() {
    // Guardar resultado automáticamente al entrar en la pantalla de resultados
    await this.guardarResultadoEnRanking();
  }

  async guardarResultadoEnRanking() {
    try {
      const user = await firstValueFrom(this.auth.user$);
      if (!user) {
        console.warn('No user logged, skipping ranking save.');
        return;
      }

      const idSemana = this.obtenerSemanaActual();
      const idJugador = user.uid;
      const nombreJugador = user.displayName || user.email || 'Jugador';
      const puntos = this.puntuacion.puntosTotales || 0;

      await this.servicioRanking.guardarPuntuacionSemanal(idSemana, idJugador, nombreJugador, puntos);
      console.log('Puntuación guardada en ranking:', { idSemana, idJugador, puntos });
    } catch (err) {
      console.error('Error guardando en ranking:', err);
    }
  }

  volverAJugar() {
    this.router.navigate(['app/modos']);
  }

   // puedes reutilizar la misma lógica para obtener semana actual
  private obtenerSemanaActual(): string {
    const now = new Date();
    const year = now.getFullYear();
    const week = this.getISOWeek(now);
    return `${year}_semana_${week}`;
  }

  private getISOWeek(date: Date): number {
    const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return weekNo;
  }
}