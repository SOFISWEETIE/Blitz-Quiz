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

@Component({
  selector: 'app-juego',
  standalone: true,
  imports: [CommonModule, PreguntaComponent, PreguntaRapidasComponent],
  templateUrl: './juego.component.html',
  styleUrl: './juego.component.css'
})
export class JuegoComponent implements OnInit {

  // Para el modo rápidas
  preguntasRapidas: any[] = [];
  indiceRapida: number = 0;

  constructor(
    public puntuacion: PuntuacionService,
    public seleccion: SeleccionService,
    private router: Router,
    private preguntasService: PreguntasService,
    private http: HttpClient  // Necesario para cargar todas las preguntas
  ) {}

  async ngOnInit() {
  this.puntuacion.reiniciar();  // ← AHORA SÍ reinicia puntosTotales = 0

  if (this.seleccion.modo === 'rapidas') {
    await this.cargarPreguntasRapidas();
    return;
  }

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

  // Carga 20 preguntas mezcladas de TODO el JSON
  private async cargarPreguntasRapidas() {
    try {
      const data: any = await firstValueFrom(this.http.get('assets/preguntas.json'));
      const todas: any[] = [];

      for (const cat in data) {
        for (const dif of ['facil', 'media', 'dificil']) {
          if (data[cat][dif]) {
            todas.push(...data[cat][dif]);
          }
        }
      }

      // Mezclamos bien
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
  

  // Para modo normal
  preguntaActual() {
    return this.puntuacion.preguntasActuales[this.puntuacion.indice];
  }

  numeroPregunta() {
    return this.puntuacion.indice + 1;
  }

  totalPreguntas() {
    return this.puntuacion.totalPreguntas;
  }

  avanzarPregunta() {
    if (this.puntuacion.indice + 1 < this.puntuacion.totalPreguntas) {
      this.puntuacion.indice++;
    } else {
      this.router.navigate(['app/resultados']);
    }
  }

  // Para modo rápidas
  preguntaActualRapida() {
    return this.preguntasRapidas[this.indiceRapida];
  }

  avanzarRapida() {
  this.indiceRapida++;
  if (this.indiceRapida >= 20) {
    this.router.navigate(['app/resultados']);
  }
}
 
}