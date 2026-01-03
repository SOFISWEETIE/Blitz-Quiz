import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-juego',
  standalone: true,
  imports: [CommonModule, PreguntaComponent, PreguntaRapidasComponent],
  templateUrl: './juego.component.html',
  styleUrl: './juego.component.css'
})
export class JuegoComponent implements OnInit {

  preguntasRapidas: any[] = [];
  indiceRapida = 0;

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

    // Reset maratón si cambiamos de modo
    if (this.seleccion.modo !== 'rapidas') {
      this.puntuacion.blitzConsecutivas = 0;
    }

    if (this.seleccion.modo === 'rapidas') {
      await this.cargarPreguntasRapidas();
    } else {
      await this.cargarPreguntasClasicas();
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
    console.log('Evento recibido:', evento);

    const logros = await this.logrosService.obtenerLogros();

    // Primer acierto
    if (evento.acierto && !logros['primerAcierto']) {
      await this.logrosService.desbloquear('primerAcierto');
    }

    // Velocista
    if (evento.acierto && evento.tiempo <= 3 && !logros['rapido']) {
      await this.logrosService.desbloquear('rapido');
    }

    // Racha general
    if (evento.acierto) {
      if (this.puntuacion.rachaActual >= 5 && !logros['rachaCinco']) {
        await this.logrosService.desbloquear('rachaCinco');
      }
      if (this.puntuacion.rachaActual >= 10 && !logros['rachaDiez']) {
        await this.logrosService.desbloquear('rachaDiez');
      }
    }

    if (this.puntuacion.indice + 1 < this.puntuacion.totalPreguntas) {
      this.puntuacion.indice++;
    } else {
      await this.finalizarPartida();
      this.router.navigate(['app/resultados']);
    }
  }

  private async finalizarPartida() {
    const logros = await this.logrosService.obtenerLogros();

    if (!logros['primerJuego']) {
      await this.logrosService.desbloquear('primerJuego');
    }

    if (!logros['clasicoIniciado']) {
      await this.logrosService.desbloquear('clasicoIniciado');
    }

    if (this.puntuacion.correctas === this.puntuacion.totalPreguntas) {
      await this.logrosService.desbloquear('perfectoClasico');
    }

    if (this.puntuacion.puntosTotales >= 500 && !logros['puntos500']) {
      await this.logrosService.desbloquear('puntos500');
    }

    this.puntuacion.incrementarPartidasJugadas();
    this.puntuacion.añadirModoJugado(this.seleccion.modo);

    if (this.puntuacion.partidasJugadas >= 10 && !logros['partidasDiez']) {
      await this.logrosService.desbloquear('partidasDiez');
    }
    if (this.puntuacion.partidasJugadas >= 50 && !logros['partidasCincuenta']) {
      await this.logrosService.desbloquear('partidasCincuenta');
    }

    if (this.puntuacion.modosJugados.size >= 3 && !logros['multiModo']) {
      await this.logrosService.desbloquear('multiModo');
    }
  }

  // MODO BLITZ
  preguntaActualRapida() { return this.preguntasRapidas[this.indiceRapida]; }

  async avanzarRapida(evento: { acierto: boolean; tiempo: number }) {
    console.log('Evento rápido recibido:', evento);

    const logros = await this.logrosService.obtenerLogros();

    if (evento.acierto) {
      if (!logros['primerAcierto']) {
        await this.logrosService.desbloquear('primerAcierto');
      }

      if (this.puntuacion.rachaActual >= 5 && !logros['rachaCinco']) {
        await this.logrosService.desbloquear('rachaCinco');
      }
      if (this.puntuacion.rachaActual >= 10 && !logros['rachaDiez']) {
        await this.logrosService.desbloquear('rachaDiez');
      }

      if (this.puntuacion.correctas >= 5 && !logros['blitzAciertosCinco']) {
        await this.logrosService.desbloquear('blitzAciertosCinco');
      }
    }

    this.indiceRapida++;

    if (this.indiceRapida >= 20) {
      await this.finalizarPartidaRapidas();
      this.router.navigate(['app/resultados']);
    }
  }

  private async finalizarPartidaRapidas() {
    const logros = await this.logrosService.obtenerLogros();

    if (!logros['primerJuego']) {
      await this.logrosService.desbloquear('primerJuego');
    }

    if (!logros['blitzValiente']) {
      await this.logrosService.desbloquear('blitzValiente');
    }

    if (this.puntuacion.correctas === 20) {
      await this.logrosService.desbloquear('perfectoBlitz');
    }

    if (this.puntuacion.puntosTotales >= 800 && !logros['blitz800']) {
      await this.logrosService.desbloquear('blitz800');
    }
    if (this.puntuacion.puntosTotales >= 1500 && !logros['puntos1500']) {
      await this.logrosService.desbloquear('puntos1500');
    }
    if (this.puntuacion.puntosTotales <= -100 && !logros['kamikazeBlitz']) {
      await this.logrosService.desbloquear('kamikazeBlitz');
    }

    
    this.puntuacion.blitzConsecutivas++;
    if (this.puntuacion.blitzConsecutivas >= 5 && !logros['blitzMaraton']) {
      await this.logrosService.desbloquear('blitzMaraton');
    }

    this.puntuacion.incrementarPartidasJugadas();
    this.puntuacion.añadirModoJugado('rapidas');

    if (this.puntuacion.partidasJugadas >= 10 && !logros['partidasDiez']) {
      await this.logrosService.desbloquear('partidasDiez');
    }
    if (this.puntuacion.partidasJugadas >= 50 && !logros['partidasCincuenta']) {
      await this.logrosService.desbloquear('partidasCincuenta');
    }

    if (this.puntuacion.modosJugados.size >= 3 && !logros['multiModo']) {
      await this.logrosService.desbloquear('multiModo');
    }
  }
}