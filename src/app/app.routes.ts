import { Routes } from '@angular/router';
import { authGuard } from './servicios/auth.guard';

export const routes: Routes = [
  // Redirige la raíz al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login standalone
  { 
    path: 'login', 
    loadComponent: () => import('./login/login.componente').then(m => m.LoginComponente)
  },

  // Modos de juego
  { 
    path: 'modos', 
    loadComponent: () => import('./componentes/modos-juego.component/modos-juego.component')
                      .then(m => m.ModosJuegoComponent)
  },

  // Categoría
  { 
    path: 'categoria', 
    loadComponent: () => import('./componentes/categoria.component/categoria.component')
                      .then(m => m.CategoriaComponent)
  },

  // Dificultad
  { 
    path: 'dificultad', 
    loadComponent: () => import('./componentes/dificultad.component/dificultad.component')
                      .then(m => m.DificultadComponent)
  },

  // Juego
  { 
    path: 'juego', 
    loadComponent: () => import('./componentes/juego.component/juego.component')
                      .then(m => m.JuegoComponent)
  },

  // Resultados
  { 
    path: 'resultados', 
    loadComponent: () => import('./componentes/resultados.component/resultados.component')
                      .then(m => m.ResultadosComponent)
  },


];
