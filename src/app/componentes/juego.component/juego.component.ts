import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PuntuacionService } from '../../servicios/puntuacion.service';
import { SeleccionService } from '../../servicios/seleccion.service';
import { PreguntasService } from '../../servicios/preguntas.service';
import { PreguntaComponent } from '../pregunta.component/pregunta.component';

@Component({
  selector: 'app-juego',
  standalone: true,
  imports: [CommonModule, PreguntaComponent],
  templateUrl: './juego.component.html',
  styleUrl: './juego.component.css'
})
export class JuegoComponent {

  constructor(
    public puntuacion: PuntuacionService,
    public seleccion: SeleccionService,
    private router: Router,
    private preguntasService: PreguntasService
  ) {}

  
  async ngOnInit() {
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

      this.puntuacion.reiniciar();
      this.puntuacion.establecerTotal(preguntas.length);
      this.puntuacion.preguntasActuales = preguntas;
    } catch (error) {
      alert('Error cargando preguntas');
      this.router.navigate(['/modos']);
    }
  }

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
      this.router.navigate(['/resultados']);
    }
  }
}
