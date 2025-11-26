    import { Routes } from '@angular/router';
    import { CategoriaComponent } from './componentes/categoria.component/categoria.component';
    import { DificultadComponent } from './componentes/dificultad.component/dificultad.component';
    import { JuegoComponent } from './componentes/juego.component/juego.component';
    import { ResultadosComponent } from './componentes/resultados.component/resultados.component';
    import { ModosJuegoComponent } from './componentes/modos-juego.component/modos-juego.component';
    import { LoginComponent } from './componentes/login.component/login.component';
    import { AuthGuard } from '@angular/fire/auth-guard';


    export const routes: Routes = [
    // 1. Si entras sin nada → al login
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    // 2. Página de login (pública, sin guard)
    { path: 'login', component: LoginComponent },
    // 3. TODAS las rutas del juego protegidas con el guard
    {
        path: 'modos',
        component: ModosJuegoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'categoria',
        component: CategoriaComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'dificultad',
        component: DificultadComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'juego',
        component: JuegoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'resultados',
        component: ResultadosComponent,
        canActivate: [AuthGuard]
    },

    // 4. Por si alguien se pierde
    { path: '**', redirectTo: 'login' }
    ];