import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { ServicioRanking } from '../../servicios/ranking.service';
import { AuthService } from '../../servicios/auth.service';
import { PuntuacionService } from '../../servicios/puntuacion.service';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Componente que muestra el ranking semanal y guarda la puntuación del usuario actual.
 * Carga el top filtrado (solo >0 puntos), guarda al finalizar partida y refresca la lista.
 */
@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent {

  /** Observable del ranking semanal actual (filtrado por puntuación > 0) */
  ranking$: any;

  constructor(
    private servicioRanking: ServicioRanking,
    private auth: AuthService,
    private puntuacion: PuntuacionService
  ) {
    // cargar ranking de la semana actual al iniciar el componente
    const semana = this.getSemanaActual();
    this.ranking$ = this.servicioRanking
      .obtenerRankingSemanal(semana)
      .pipe(
        map((ranking: any[]) =>
          ranking.filter(jugador => jugador.puntuacion > 0)
        )
      );

  }

  /**
   * Guarda la puntuación del usuario actual en el ranking semanal.
   * Usa el alias y mascota del usuario, suma puntos de la partida actual
   * y refresca el observable para que se vea el nuevo top inmediatamente.
   */
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
      const puntos = this.puntuacion.puntosTotales ?? 0;

      // Llamada al servicio que guarda en Firestore (asumo que devuelve Promise)
      await this.servicioRanking.guardarPuntuacionSemanal(
        idSemana,
        idJugador,
        nombreJugador,
        puntos,
        mascotaJugador
      );

      // refresh del ranking para que se vea el nuevo registro en la lista
      this.ranking$ = this.servicioRanking
        .obtenerRankingSemanal(idSemana)
        .pipe(
          map((ranking: any[]) =>
            ranking.filter(jugador => jugador.puntuacion > 0)
          )
        );


      console.log(`Guardado ranking: ${nombreJugador} (${idJugador}) — ${puntos} pts — mascota: ${mascotaJugador}`);
    } catch (err) {
      console.error('Error guardando ranking:', err);
    }
  }

  
  /**
   * Genera el ID de la semana actual en formato "YYYY_semana_N".
   * Usa getISOWeek para calcular la semana ISO estándar.
   */
  private getSemanaActual(): string {
    const now = new Date();
    const year = now.getFullYear();
    const week = this.getISOWeek(now);
    return `${year}_semana_${week}`;
  }

  /**
   * Calcula el número de semana ISO (1-53) para la fecha dada.
   * Algoritmo estándar .
   */
  private getISOWeek(date: Date): number {
    const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return weekNo;
  }
}



