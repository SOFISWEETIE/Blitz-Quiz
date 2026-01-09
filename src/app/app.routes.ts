import { Routes } from '@angular/router';
import { CategoriaComponent } from './componentes/categoria.component/categoria.component';
import { DificultadComponent } from './componentes/dificultad.component/dificultad.component';
import { JuegoComponent } from './componentes/juego.component/juego.component';
import { ResultadosComponent } from './componentes/resultados.component/resultados.component';
import { ModosJuegoComponent } from './componentes/modos-juego.component/modos-juego.component';
import { LoginComponent } from './componentes/login.component/login.component';
import { LayoutComponent } from './componentes/layout.component/layout.component';
import { CrearAliasComponent } from './componentes/crear.alias.component/crear.alias.component';
import { AliasGuard } from './servicios/alias.guard';


import { AuthGuard } from '@angular/fire/auth-guard';
import { redirectUnauthorizedTo } from '@angular/fire/auth-guard';

import { LogrosComponent } from './componentes/logros.component/logros.component';


const redirectToLogin = () => redirectUnauthorizedTo(['login']);

import { JuegoGuardService } from './servicios/juego.guard';


export const routes: Routes = [
  // 1. Entrada vacía → login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 2. Login público
  { path: 'login', component: LoginComponent },

  // 3. TODAS LAS RUTAS PROTEGIDAS con Layout
  {
    path: 'app',
    component: LayoutComponent,
    canActivate: [AuthGuard],           
    data: { authGuardPipe: redirectToLogin },  

    children: [
      { path: 'crear-alias', component: CrearAliasComponent },
      { path: 'modos', component: ModosJuegoComponent },
      { path: 'logros', component: LogrosComponent },
      { path: 'categoria', component: CategoriaComponent },
      { path: 'dificultad', component: DificultadComponent },
      { path: 'juego', component: JuegoComponent, canActivate: [AliasGuard], canDeactivate: [JuegoGuardService] },
      { path: 'resultados', component: ResultadosComponent },
      { path: '', redirectTo: 'modos', pathMatch: 'full' }
    ]
  },

  // 4. Cualquier otra cosa → login
  { path: '**', redirectTo: 'login' }
];
