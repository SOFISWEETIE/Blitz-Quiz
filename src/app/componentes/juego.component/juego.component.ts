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

      const preguntas = await this.preguntasService.obtenerPreguntas(categoria, dificultad);
      this.puntuacion.establecerTotal(preguntas.length);
      this.puntuacion.preguntasActuales = preguntas;

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

  // MODO CLÁSICO
  preguntaActual() { return this.puntuacion.preguntasActuales[this.puntuacion.indice]; }
  numeroPregunta() { return this.puntuacion.indice + 1; }
  totalPreguntas() { return this.puntuacion.totalPreguntas; }


async avanzarPregunta(evento: { acierto: boolean; tiempo: number }) {
  console.log('Evento recibido:', evento);

  const logros = await this.logrosService.obtenerLogros();

  // Primer acierto, si no estaba desbloqueado
  if (evento.acierto && !logros['primerAcierto']) {
    await this.logrosService.desbloquear('primerAcierto');
  }

  // Velocista, acierto en menos de 3 segundos
  if (evento.acierto && evento.tiempo <= 3 && !logros['rapido']) {
    await this.logrosService.desbloquear('rapido');
  }

  if (this.puntuacion.indice + 1 < this.puntuacion.totalPreguntas) {
    this.puntuacion.indice++;
  } else {
    await this.finalizarPartida();
    this.router.navigate(['app/resultados']);
  }
}


  private async finalizarPartida() {
  // Desbloquear primer juego solo si es la primera vez
  const logros = await this.logrosService.obtenerLogros();
  if (!logros['primerJuego']) {
    await this.logrosService.desbloquear('primerJuego');
  }

  // Desbloquear racha perfecta solo si todas las respuestas son correctas
  if (this.puntuacion.correctas === this.puntuacion.totalPreguntas) {
    await this.logrosService.desbloquear('rachaPerfecta');
  }
}

  //MODO RÁPIDAS
  preguntaActualRapida() { return this.preguntasRapidas[this.indiceRapida]; }

  async avanzarRapida(evento: { acierto: boolean; tiempo: number }) {
  console.log('Evento rápido recibido:', evento);

  if (evento.acierto) {
    await this.logrosService.desbloquear('primerAcierto');
  }

  this.indiceRapida++;

  if (this.indiceRapida >= 20) {
    await this.finalizarPartidaRapidas();
    this.router.navigate(['app/resultados']);
  }
}

  private async finalizarPartidaRapidas() {
    await this.logrosService.desbloquear('primerJuego');

    if (this.puntuacion.correctas === 20) {
      await this.logrosService.desbloquear('rachaPerfecta');
    }
  }
}
