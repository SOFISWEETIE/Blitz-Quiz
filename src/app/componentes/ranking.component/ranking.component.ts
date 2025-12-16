import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { ServicioRanking } from '../../servicios/ranking.service';
import { AuthService } from '../../servicios/auth.service';
import { PuntuacionService } from '../../servicios/puntuacion.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent {
  ranking$: any;

  constructor(
    private servicioRanking: ServicioRanking,
    private auth: AuthService,
    private puntuacion: PuntuacionService
  ) {
    // cargar ranking de la semana actual al iniciar el componente
    const semana = this.getSemanaActual();
    this.ranking$ = this.servicioRanking.obtenerRankingSemanal(semana);
  }

  // metodo que guarda la puntuacion del usuario actual en la semana actual
  async finalizarJuego() {
    try {
      const user = await firstValueFrom(this.auth.user$);
      if (!user) {
        console.warn('No hay usuario logueado. No se guarda ranking.');
        return;
      }

      const aliasData = this.auth.alias$.value; 
      if (!aliasData) { 
        console.warn('No hay alias cargado. No se guarda en el ranking.'); 
        return; 
      }

      const idSemana = this.getSemanaActual();             // ej: "2025_semana_1"
      const idJugador = user.uid;
      const nombreJugador = aliasData.alias;
      const mascotaJugador = aliasData.mascota; 
      const puntos = this.puntuacion.puntosTotales || 0;

      // Llamada al servicio que guarda en Firestore (asumo que devuelve Promise)
      await this.servicioRanking.guardarPuntuacionSemanal( 
        idSemana, 
        idJugador, 
        nombreJugador, 
        puntos, 
        mascotaJugador 
      );

      // refresh del ranking para que se vea el nuevo registro en la lista
      this.ranking$ = this.servicioRanking.obtenerRankingSemanal(idSemana);

      console.log(`Guardado ranking: ${nombreJugador} (${idJugador}) — ${puntos} pts — mascota: ${mascotaJugador}`);
    } catch (err) {
      console.error('Error guardando ranking:', err);
    }
  }

  // genera la semana actual en formato "YYYY_semana_N"
  private getSemanaActual(): string {
    const now = new Date();
    const year = now.getFullYear();
    const week = this.getISOWeek(now);
    return `${year}_semana_${week}`;
  }

  // función helper para número ISO de semana (1..53) esto lo busque porque ni idea
  private getISOWeek(date: Date): number {
    const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // Thursday in current week decides the year.
    tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return weekNo;
  }
}



