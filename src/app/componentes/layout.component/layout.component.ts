import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { RankingComponent } from '../ranking.component/ranking.component';
import { BehaviorSubject } from 'rxjs';

/* Componente responsable del layout principal de la aplicación, 
   incluyendo la barra superior, menú de perfil, menú de ranking 
   y la zona donde se cargan las rutas hijas router-outlet */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RankingComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {


  /* Datos del usuario alias y mascota obtenidos del servicio de autenticación */
  aliasData$: BehaviorSubject<{ alias: string; mascota: string } | null>;
  /* Estado de visibilidad del menú de perfil */
  menuAbierto = false;
  /* Estado de visibilidad del menú de ranking */
  rankingAbierto = false;
  /* Controla si el ranking está desactivado  */
  desactivarRanking = false;

  constructor(public auth: AuthService, private router: Router) {
    this.aliasData$ = this.auth.alias$;

    /* Observa cambios de ruta para ajustar visibilidad de ranking */
    this.router.events.subscribe(() => {
      this.desactivarRanking = this.router.url.includes('resultados');

      /* Cierra ranking automáticamente si estamos en resultados */
      if (this.desactivarRanking) {
        this.rankingAbierto = false;
      }
    });
  }

  /* Alterna la visibilidad del menú de perfil */
  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
    this.rankingAbierto = false;
  }

  /* Alterna la visibilidad del menú de ranking, si no está desactivado */
  toggleRanking() {
    if (this.desactivarRanking) return;

    this.rankingAbierto = !this.rankingAbierto;
    this.menuAbierto = false;
  }

  /* Navega a la sección de logros y cierra el menú de perfil */
  irALogros() {
    this.menuAbierto = false;
    this.router.navigate(['/app/logros']);
  }


  /* Cierra sesión y redirige al login */
  async salir() {
    await this.auth.logout();
    await this.router.navigate(['/login']);
  }

  /* Redirige a la página de creación/cambio de alias */
  cambiarAlias() {
    this.menuAbierto = false;
    this.router.navigate(['/app/crear-alias']);
  }

  /* Redirige a la página principal de modos de juego */
  irAlInicio() {
    this.router.navigate(['/app/modos']);
  }

}

