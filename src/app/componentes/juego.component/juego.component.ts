import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuntuacionService } from '../../servicios/puntuacion.service';
import { SeleccionService } from '../../servicios/seleccion.service';
import { PreguntasService } from '../../servicios/preguntas.service';
import { Router } from '@angular/router';
import { Subject, timer, takeUntil } from 'rxjs'; // Quité Subscription innecesario, simplifiqué
import { ChangeDetectionStrategy } from '@angular/core';




@Component({
  selector: 'app-juego',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './juego.component.html',
  styleUrl: './juego.component.css'
})
export class JuegoComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  tiempoPorPregunta: number = 20;
  tiempoRestante: number = 0;

  private correctaActual: string = '';
  opcionesMezcladas: string[] = []; // ¡Aquí guardamos las opciones FIJAS!

  cargando: boolean = true;
  errorCarga: string = ''; // Para mensajes de "¡no hay preguntas, pringao!"

  constructor(
    public puntuacion: PuntuacionService,
    public seleccion: SeleccionService,
    private router: Router,
    private preguntasService: PreguntasService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): void {
    console.log('Iniciando JuegoComponent... ¡A ver qué pasa! 😂');
    this.tiempoRestante = this.tiempoPorPregunta;
    await this.cargarPreguntas(); // Espera de verdad
    this.cargando = false;
    if (this.totalPreguntas() > 0) {
      this.mezclarOpciones();
      this.iniciarTemporizador();
    }
    this.cdr.detectChanges(); // Fuerza refresh inicial
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  iniciarTemporizador() {
    console.log('Iniciando timer para pregunta ' + this.numeroPregunta());
    this.tiempoRestante = this.tiempoPorPregunta;
    timer(0, 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.tiempoRestante > 0) {
          this.tiempoRestante--;
          this.cdr.detectChanges(); // ¡Cada segundo refresh SOLO del timer, no reshuffle!
        } else {
          this.tiempoAcabado();
        }
      });
  }

  tiempoAcabado() {
    console.log('¡Tiempo acabado! Pasando a siguiente...');
    this.siguientePregunta();
  }

  private siguientePregunta() {
    this.puntuacion.indice++;
    if (this.puntuacion.indice >= this.puntuacion.preguntasActuales.length) {
      this.router.navigate(['/resultados']);
    } else {
      this.mezclarOpciones(); // Solo aquí remézclalas
      this.iniciarTemporizador();
      this.cdr.detectChanges();
    }
  }

  responder(respuestaSeleccionada: string) {
    const esCorrecta = respuestaSeleccionada === this.correctaActual;
    if (esCorrecta) {
      this.puntuacion.sumarAcierto();
    }
    this.siguientePregunta();
  }

  private mezclarOpciones() {
    const pregunta = this.preguntaActual();
    if (!pregunta?.opciones) return;

    this.opcionesMezcladas = [...pregunta.opciones];
    for (let i = this.opcionesMezcladas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.opcionesMezcladas[i], this.opcionesMezcladas[j]] = [this.opcionesMezcladas[j], this.opcionesMezcladas[i]];
    }
    this.correctaActual = pregunta.correcta;
    console.log('Opciones mezcladas FIJAS: ', this.opcionesMezcladas); // Log para ver que no cambia
  }

  preguntaActual() {
    return this.puntuacion.preguntasActuales[this.puntuacion.indice];
  }

  numeroPregunta() { return this.puntuacion.indice + 1; }
  totalPreguntas() { return this.puntuacion.totalPreguntas; }

  private async cargarPreguntas() {
    this.cargando = true;
    this.errorCarga = '';
    try {
      let preguntas = [];
      if (this.seleccion.modo === 'aleatorio') {
        const categorias = ['Arte', 'Ciencia', 'Deporte', 'Entretenimiento', 'Geografia', 'Historia'];
        const dificultades = ['facil', 'media', 'dificil'];
        const cat = categorias[Math.floor(Math.random() * categorias.length)];
        const dif = dificultades[Math.floor(Math.random() * dificultades.length)];
        this.seleccion.establecerCategoria(cat);
        this.seleccion.establecerDificultad(dif);
        preguntas = await this.preguntasService.obtenerPreguntas(cat, dif);
      } else if (this.seleccion.modo === 'clasico') {
        preguntas = await this.preguntasService.obtenerPreguntas(this.seleccion.categoria, this.seleccion.dificultad);
      }

      if (preguntas.length === 0) {
        this.errorCarga = '¡No hay preguntas en esta combo! Elige otra o Firebase está de huelga 😂';
        this.router.navigate(['/modos']);
        return;
      }

      this.puntuacion.reiniciar();
      this.puntuacion.establecerTotal(preguntas.length);
      this.puntuacion.preguntasActuales = preguntas;
      console.log('Preguntas cargadas: ', preguntas.length); // Log para ver si carga
    } catch (error) {
      this.errorCarga = 'Error fatal cargando: ' + error + ' 😱';
      this.router.navigate(['/modos']);
    }
    this.cargando = false;
  }
}