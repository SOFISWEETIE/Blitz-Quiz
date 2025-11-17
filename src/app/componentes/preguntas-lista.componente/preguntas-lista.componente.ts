// Componente que lista las preguntas obtenidas desde Firestore

import { Component, OnInit, OnDestroy } from '@angular/core';
import { PreguntaServicio } from '../../servicios/pregunta.servicio';
import { AuthServicio } from '../../servicios/auth.servicio';
import { Pregunta } from '../../modelos/pregunta.modelo';
import { AsyncPipe } from '@angular/common';
import { PreguntaComponente } from '../../pregunta.componente/pregunta.componente';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule} from '@angular/common';

@Component({
  selector: 'app-preguntas-lista',
  standalone: true,
  imports: [CommonModule, AsyncPipe, PreguntaComponente],
  templateUrl: './preguntas-lista.componente.html',
  styleUrl: './preguntas-lista.componente.css'
})
export class PreguntasListaComponente implements OnDestroy {
  // rescatamos las preguntas como un observable
  preguntas$!: Observable<Pregunta[]>;
  user$!: import('rxjs').BehaviorSubject<import('firebase/auth').User | null>; // nuevo
  private userSub?: Subscription; // nuevo

  // llama al servicio para obtener las preguntas
  constructor(private preguntaServicio: PreguntaServicio, private auth: AuthServicio, private router: Router) {
    this.preguntas$ = this.preguntaServicio.obtenerPreguntas();
    this.user$ = this.auth.user$; // nuevo

    // nuevo
    // Si el usuario cierra sesión mientras está en esta ruta, redirigimos a /login
    this.userSub = this.user$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

// nuevo
  logout() {
    this.auth.logout();
  }
// nuevo
  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

}
