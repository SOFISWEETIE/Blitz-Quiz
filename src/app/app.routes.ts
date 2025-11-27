    import { Routes } from '@angular/router';
    import { CategoriaComponent } from './componentes/categoria.component/categoria.component';
    import { DificultadComponent } from './componentes/dificultad.component/dificultad.component';
    import { JuegoComponent } from './componentes/juego.component/juego.component';
    import { ResultadosComponent } from './componentes/resultados.component/resultados.component';
    import { ModosJuegoComponent } from './componentes/modos-juego.component/modos-juego.component';
    import { LoginComponent } from './componentes/login.component/login.component';
    import { AuthGuard } from '@angular/fire/auth-guard';
    import { LayoutComponent } from './componentes/layout.component/layout.component';


    export const routes: Routes = [
    // 1. Si entras sin nada → al login
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    // 2. Página de login (pública, sin guard)
    { path: 'login', component: LoginComponent },
    // 3. TODAS las rutas del juego protegidas con el guard
    {
        path: 'app',
        component: LayoutComponent,
        canActivate: [AuthGuard],

       children: [
      { path: 'modos', component: ModosJuegoComponent },
      { path: 'categoria', component: CategoriaComponent },
      { path: 'dificultad', component: DificultadComponent },
      { path: 'juego', component: JuegoComponent },
      { path: 'resultados', component: ResultadosComponent }
    ]
  },

    // 4. Por si alguien se pierde
    { path: '**', redirectTo: 'login' }
    ];