import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeleccionService } from '../../servicios/seleccion.service';
import { PuntuacionService } from '../../servicios/puntuacion.service';
import { Router } from '@angular/router';
import { ServicioRanking } from '../../servicios/ranking.service';
import { AuthService } from '../../servicios/auth.service';
import { firstValueFrom } from 'rxjs';
import { RankingComponent } from '../ranking.component/ranking.component';
import { frasesMotivadoras } from './frases-motivadoras';
import confetti from 'canvas-confetti';

/**
 * Componente de pantalla final de resultados.
 * Muestra puntuación animada, puesto en ranking, frase motivadora,
 * lanza confeti si hay puntos, guarda en ranking semanal y ofrece
 * jugar otra vez o volver a modos.
 */
@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule, RankingComponent],
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent {
  puestoJugador: number | null = null;
  frase: string = '';
  puntosAnimados = 0;

  constructor(
    public seleccion: SeleccionService,
    public puntuacion: PuntuacionService,
    private router: Router,
    private servicioRanking: ServicioRanking,
    private auth: AuthService
  ) { }

  /**
   * Al cargar la pantalla: guarda resultado en ranking, calcula puesto,
   * elige frase random, lanza confeti si hay puntos y anima la suma de puntos.
   */
  async ngOnInit() {
    await this.guardarResultadoEnRanking();
    await this.calcularPuestoJugador();
    const randomIndex = Math.floor(Math.random() * frasesMotivadoras.length);
    this.frase = frasesMotivadoras[randomIndex];
    // Se lanza confeti si la puntuación es mayor que 0 
    if (this.puntuacion.puntosTotales > 0) {
      this.lanzarConfeti();
    }
    this.animarPuntos();
  }

  /**
   * Guarda la puntuación de la partida actual en el ranking semanal de Firestore.
   * Usa alias y mascota del usuario, y refresca si hace falta.
   */
  async guardarResultadoEnRanking() {
    try {
      const user = await firstValueFrom(this.auth.user$);
      const aliasData = this.auth.alias$.value;
      if (!user) {
        console.warn('No user logged, skipping ranking save.');
        return;
      }

      const idSemana = this.obtenerSemanaActual();
      const idJugador = user.uid;
      const nombreJugador = aliasData?.alias || 'Jugador';
      const mascotaJugador = aliasData?.mascota || 'assets/mascotas/default.png';
      const puntos = this.puntuacion.puntosTotales || 0;

      await this.servicioRanking.guardarPuntuacionSemanal(
        idSemana,
        idJugador,
        nombreJugador,
        puntos,
        mascotaJugador
      );
      console.log('Puntuación guardada en ranking:', { idSemana, idJugador, puntos });
    } catch (err) {
      console.error('Error guardando en ranking:', err);
    }
  }

  /**
   * Calcula el puesto del jugador actual en el ranking semanal.
   * Busca por alias y asigna posición (1-based) o null si no está.
   */
  async calcularPuestoJugador() {
    const aliasData = this.auth.alias$.value;
    const alias = aliasData?.alias;

    if (!alias) {
      this.puestoJugador = null;
      return;
    }

    const idSemana = this.obtenerSemanaActual();
    const ranking = await firstValueFrom(
      this.servicioRanking.obtenerRankingSemanal(idSemana)
    ) as any[];

    const index = ranking.findIndex(j => j.jugador === alias);
    this.puestoJugador = index !== -1 ? index + 1 : null;
  }


  irInicio() {
    this.router.navigate(['app/modos']);
  }

  /**
   * Reinicia puntuación y selección para empezar una nueva partida,
   * y navega directo al juego.
   */
  jugarOtraVez() {
    this.puntuacion.resetPuntuacion();
    this.seleccion.prepararNuevaPartida();
    this.router.navigate(['app/juego']);
  }

  /**
   * Obtiene ID de la semana actual en formato "YYYY_semana_N" (ISO week).
   */
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

  /**
   * Lanza confeti desde los lados durante 1.5 segundos si hay puntos.
   */
  private lanzarConfeti() {
    const duration = 1500; 
    const end = Date.now() + duration;

    const frame = () => {
      // Lado izquierdo
      confetti({
        particleCount: 8,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 }
      });

      // Lado derecho
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }

  /**
   * Anima los puntos subiendo poco a poco desde 0 hasta el total (efecto motivador).
   */
  private animarPuntos() {
    const total = this.puntuacion.puntosTotales;
    let current = 0;

    const step = Math.ceil(total / 40);

    const interval = setInterval(() => {
      current += step;

      if (current >= total) {
        this.puntosAnimados = total;
        clearInterval(interval);
      } else {
        this.puntosAnimados = current;
      }
    }, 20);
  }

}
