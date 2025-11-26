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
  styleUrls: ['./juego.component.css']
})
export class JuegoComponent implements OnInit {
  preguntasRapidas: any[] = [];
  indiceRapida: number = 0;

  constructor(
    public puntuacion: PuntuacionService,
    public seleccion: SeleccionService,
    private router: Router,
    private preguntasService: PreguntasService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    this.puntuacion.reiniciar();

    // Verificamos que la dificultad y categoría existan
    if (!this.seleccion.dificultad && this.seleccion.modo === 'clasico') {
      console.warn('No hay dificultad seleccionada, redirigiendo a modos');
      this.router.navigate(['/modos']);
      return;
    }

    if (this.seleccion.modo === 'rapidas') {
      await this.cargarPreguntasRapidas();
      return;
    }

    try {
      let categoria = this.seleccion.categoria || this.seleccion.establecerCategoriaAleatoria();
      let dificultad = this.seleccion.dificultad || this.seleccion.establecerDificultadAleatoria();

      const preguntas = await this.preguntasService.obtenerPreguntas(categoria, dificultad);
      this.puntuacion.establecerTotal(preguntas.length);
      this.puntuacion.preguntasActuales = preguntas;

    } catch (error) {
      console.error('Error cargando preguntas:', error);
      alert('Error cargando preguntas');
      this.router.navigate(['/modos']);
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

      // Mezclar y tomar primeras 20
      this.preguntasRapidas = todas.sort(() => Math.random() - 0.5).slice(0, 20);

    } catch (error) {
      console.error('Error cargando preguntas rápidas:', error);
      alert('Error cargando preguntas rápidas');
      this.router.navigate(['/modos']);
    }
  }

  // Preguntas normales
  preguntaActual() {
    return this.puntuacion.preguntasActuales[this.puntuacion.indice] || null;
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
      this.router.navigate(['/resultados']);
    }
  }

  // Preguntas rápidas
  preguntaActualRapida() {
    return this.preguntasRapidas[this.indiceRapida] || null;
  }

  avanzarRapida() {
    this.indiceRapida++;
    if (this.indiceRapida >= 20) {
      this.router.navigate(['/resultados']);
    }
  }
}
