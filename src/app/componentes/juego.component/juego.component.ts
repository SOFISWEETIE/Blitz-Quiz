import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { PuntuacionService } from '../../servicios/puntuacion.service';
import { SeleccionService } from '../../servicios/seleccion.service';
import { PreguntasService } from '../../servicios/preguntas.service';

import { PreguntaComponent } from '../pregunta.component/pregunta.component';
import { PreguntaRapidasComponent } from '../preguntas-rapidas.component/preguntas-rapidas.component';

import { LogrosService } from '../../servicios/logros.service';

import { JuegoGuard } from '../../servicios/juego.guard';

@Component({
  selector: 'app-juego',
  standalone: true,
  imports: [CommonModule, PreguntaComponent, PreguntaRapidasComponent],
  templateUrl: './juego.component.html',
  styleUrl: './juego.component.css'
})
export class JuegoComponent implements OnInit, JuegoGuard {

  preguntasRapidas: any[] = [];
  indiceRapida = 0;

  partidaTerminada = false; 
  mostrarModalSalir = false;

  logroDesbloqueado: string | null = null;
  colaLogros: string[] = [];
  mostrandoLogro = false;

 

  private _resolverSalir?: (valor: boolean) => void;

  constructor(
    public puntuacion: PuntuacionService,
    public seleccion: SeleccionService,
    private router: Router,
    private preguntasService: PreguntasService,
    private http: HttpClient,
    private logrosService: LogrosService
  ) {}

  async ngOnInit() {
    this.puntuacion.reiniciar();
    await this.logrosService.inicializarLogros();

    if (this.seleccion.modo !== 'rapidas') {
      this.puntuacion.blitzConsecutivas = 0;
    }

    if (this.seleccion.modo === 'rapidas') {
      await this.cargarPreguntasRapidas();
    } else {
      await this.cargarPreguntasClasicas();
    }
  }

   // BLOQUEO DE SALIDA
  
  puedeSalir(): Promise<boolean> {
    return new Promise(resolve => {
      if (this.partidaTerminada) {
        resolve(true);
        return;
      }

      this._resolverSalir = (valor: boolean) => {
        resolve(valor);            
        this._resolverSalir = undefined;
      };

      this.mostrarModalSalir = true;
    });
  }

  confirmarSalir() {
    this.partidaTerminada = true;
    this.mostrarModalSalir = false;
    if (this._resolverSalir) {
      this._resolverSalir(true);
    }
    this.router.navigate(['app/modos']);
  }

  cancelarSalir() {
    this.mostrarModalSalir = false;
    if (this._resolverSalir) {
      this._resolverSalir(false);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  bloquearRecarga(event: BeforeUnloadEvent) {
    if (!this.partidaTerminada) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  private async cargarPreguntasClasicas() {
    try {
      let categoria: string;
      let dificultad: string;

      if (this.seleccion.modo === 'clasico') {
        categoria = this.seleccion.categoria;
        dificultad = this.seleccion.dificultad;
      } else {
        categoria = this.seleccion.establecerCategoriaAleatoria();
        dificultad = this.seleccion.establecerDificultadAleatoria();
      }

      const todasLasPreguntas = await this.preguntasService.obtenerPreguntas(categoria, dificultad);

      const preguntasMezcladas = [...todasLasPreguntas];
      for (let i = preguntasMezcladas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [preguntasMezcladas[i], preguntasMezcladas[j]] = [preguntasMezcladas[j], preguntasMezcladas[i]];
      }

      const preguntasParaJugar = preguntasMezcladas.slice(0, 20);

      this.puntuacion.establecerTotal(preguntasParaJugar.length);
      this.puntuacion.preguntasActuales = preguntasParaJugar;

    } catch (error) {
      alert('Error cargando preguntas');
      this.router.navigate(['app/modos']);
    }
  }

  private async cargarPreguntasRapidas() {
    try {
      const data: any = await firstValueFrom(this.http.get('assets/preguntas.json'));
      const todas: any[] = [];

      for (const cat in data) {
        for (const dif of ['facil', 'media', 'dificil']) {
          if (data[cat][dif]) todas.push(...data[cat][dif]);
        }
      }

      for (let i = todas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [todas[i], todas[j]] = [todas[j], todas[i]];
      }

      this.preguntasRapidas = todas.slice(0, 20);
    } catch (error) {
      alert('Error cargando preguntas rápidas');
      this.router.navigate(['app/modos']);
    }
  }

  // MODO CLÁSICO / ALEATORIO
  preguntaActual() { return this.puntuacion.preguntasActuales[this.puntuacion.indice]; }
  numeroPregunta() { return this.puntuacion.indice + 1; }
  totalPreguntas() { return this.puntuacion.totalPreguntas; }

  async avanzarPregunta(evento: { acierto: boolean; tiempo: number }) {
    const logros  = await this.logrosService.obtenerLogros();

    // Primer acierto
    if (evento.acierto && !logros['primerAcierto']) {
      const logro: string = await this.logrosService.desbloquear('primerAcierto');
      this.mostrarNotificacionLogro(logro);
    }

    // Racha general
    if (evento.acierto) {
      if (this.puntuacion.rachaActual >= 5 && !logros['rachaCinco']) {
        const logro: string = await this.logrosService.desbloquear('rachaCinco');
        this.mostrarNotificacionLogro(logro);
      }
      if (this.puntuacion.rachaActual >= 10 && !logros['rachaDiez']) {
        const logro: string = await this.logrosService.desbloquear('rachaDiez');
        this.mostrarNotificacionLogro(logro);
      }
    }

    if (this.puntuacion.indice + 1 < this.puntuacion.totalPreguntas) {
      this.puntuacion.indice++;
    } else {
      this.partidaTerminada = true;
      await this.finalizarPartida();
      this.router.navigate(['app/resultados']);
    }
  }

  private async finalizarPartida() {
    const logros = await this.logrosService.obtenerLogros();

    if (!logros['primerJuego']) {
      const logro: string = await this.logrosService.desbloquear('primerJuego');
      this.mostrarNotificacionLogro(logro);
    }

    if (!logros['clasicoIniciado']) {
      const logro: string = await this.logrosService.desbloquear('clasicoIniciado');
      this.mostrarNotificacionLogro(logro);
    }

    // Perfecto clásico/aleatorio
    if (this.puntuacion.correctas === this.puntuacion.totalPreguntas) {
      const logro: string = await this.logrosService.desbloquear('rachaPerfectaClasico');
      this.mostrarNotificacionLogro(logro);
    }

    // Puntos generales (plata)
    if (this.puntuacion.puntosTotales >= 150 && !logros['puntos150']) {
      const logro: string = await this.logrosService.desbloquear('puntos150');
      this.mostrarNotificacionLogro(logro);
    }

    // Puntos diamante (para cualquier modo, aunque sea difícil)
    if (this.puntuacion.puntosTotales >= 300 && !logros['puntos300']) {
      const logro: string = await this.logrosService.desbloquear('puntos300');
      this.mostrarNotificacionLogro(logro);
    }

    this.puntuacion.incrementarPartidasJugadas();
    this.puntuacion.añadirModoJugado(this.seleccion.modo);

    if (this.puntuacion.partidasJugadas >= 10 && !logros['partidasDiez']) {
      const logro: string = await this.logrosService.desbloquear('partidasDiez');
      this.mostrarNotificacionLogro(logro);
    }
    if (this.puntuacion.partidasJugadas >= 50 && !logros['partidasCincuenta']) {
      const logro: string = await this.logrosService.desbloquear('partidasCincuenta');
      this.mostrarNotificacionLogro(logro);
    }

    if (this.puntuacion.modosJugados.size >= 3 && !logros['multiModo']) {
      const logro: string = await this.logrosService.desbloquear('multiModo');
      this.mostrarNotificacionLogro(logro);
    }
  }

  // MODO BLITZ
  preguntaActualRapida() { return this.preguntasRapidas[this.indiceRapida]; }

  async avanzarRapida(evento: { acierto: boolean; tiempo: number }) {
    const logros = await this.logrosService.obtenerLogros();

    if (evento.acierto) {
      // Racha general (también cuenta en blitz)
      if (this.puntuacion.rachaActual >= 5 && !logros['rachaCinco']) {
        const logro: string = await this.logrosService.desbloquear('rachaCinco');
        this.mostrarNotificacionLogro(logro);
      }
      if (this.puntuacion.rachaActual >= 10 && !logros['rachaDiez']) {
        const logro: string = await this.logrosService.desbloquear('rachaDiez');
        this.mostrarNotificacionLogro(logro);
      }

      // Blitz velocista (5 aciertos en blitz)
      if (this.puntuacion.correctas >= 5 && !logros['blitzRapido']) {
        const logro: string = await this.logrosService.desbloquear('blitzRapido');
        this.mostrarNotificacionLogro(logro);
      }
    }

    this.indiceRapida++;

    if (this.indiceRapida >= 20) {
      this.partidaTerminada = true;
      await this.finalizarPartidaRapidas();
      this.router.navigate(['app/resultados']);
    }
  }

  private async finalizarPartidaRapidas() {
    const logros = await this.logrosService.obtenerLogros();

    if (!logros['primerJuego']) {
      const logro: string = await this.logrosService.desbloquear('primerJuego');
      this.mostrarNotificacionLogro(logro);
    }

    if (!logros['blitzValiente']) {
      const logro: string = await this.logrosService.desbloquear('blitzValiente');
      this.mostrarNotificacionLogro(logro);
    }

    // Perfecto Blitz
    if (this.puntuacion.correctas === 20) {
      const logro: string = await this.logrosService.desbloquear('blitzPerfecto');
      this.mostrarNotificacionLogro(logro);
    }

    // Puntos plata general
    if (this.puntuacion.puntosTotales >= 150 && !logros['puntos150']) {
      const logro: string = await this.logrosService.desbloquear('puntos150');
      this.mostrarNotificacionLogro(logro);
    }

    // Superviviente Blitz (oro)
    if (this.puntuacion.puntosTotales >= 150 && !logros['blitzSobreviviente']) {
      const logro: string = await this.logrosService.desbloquear('blitzSobreviviente');
      this.mostrarNotificacionLogro(logro);
    }

    // Millonario diamante
    if (this.puntuacion.puntosTotales >= 300 && !logros['puntos300']) {
      const logro: string = await this.logrosService.desbloquear('puntos300');
      this.mostrarNotificacionLogro(logro);
    }

    // Maratón Blitz
    this.puntuacion.blitzConsecutivas++;
    if (this.puntuacion.blitzConsecutivas >= 5 && !logros['blitzMaraton']) {
      const logro: string = await this.logrosService.desbloquear('blitzMaraton');
      this.mostrarNotificacionLogro(logro);
    }

    this.puntuacion.incrementarPartidasJugadas();
    this.puntuacion.añadirModoJugado('rapidas');

    if (this.puntuacion.partidasJugadas >= 10 && !logros['partidasDiez']) {
      const logro: string = await this.logrosService.desbloquear('partidasDiez');
      this.mostrarNotificacionLogro(logro);
    }
    if (this.puntuacion.partidasJugadas >= 50 && !logros['partidasCincuenta']) {
      const logro: string = await this.logrosService.desbloquear('partidasCincuenta');
      this.mostrarNotificacionLogro(logro);
    }

    if (this.puntuacion.modosJugados.size >= 3 && !logros['multiModo']) {
      const logro: string = await this.logrosService.desbloquear('multiModo');
      this.mostrarNotificacionLogro(logro);
    }
  }

  mostrarNotificacionLogro(id: string) {
    this.colaLogros.push(id);
    this.procesarColaLogros();
  }

  private procesarColaLogros() {
    if (this.mostrandoLogro || this.colaLogros.length === 0) return;

    this.mostrandoLogro = true;
    this.logroDesbloqueado = this.colaLogros.shift()!;

    setTimeout(() => {
      this.logroDesbloqueado = null;
      this.mostrandoLogro = false;
      this.procesarColaLogros();
    }, 4500);
  }


}
