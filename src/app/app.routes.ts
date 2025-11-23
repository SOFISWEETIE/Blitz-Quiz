    import { Routes } from '@angular/router';
    import { CategoriaComponent } from './componentes/categoria.component/categoria.component';
    import { DificultadComponent } from './componentes/dificultad.component/dificultad.component';
    import { JuegoComponent } from './componentes/juego.component/juego.component';
    import { ResultadosComponent } from './componentes/resultados.component/resultados.component';
    import { ModosJuegoComponent } from './componentes/modos-juego.component/modos-juego.component';


    export const routes: Routes = [
    { path: '', redirectTo: 'modos', pathMatch: 'full' },
    { path: 'modos', component: ModosJuegoComponent },
    { path: 'categoria', component: CategoriaComponent },
    { path: 'dificultad', component: DificultadComponent },
    { path: 'juego', component: JuegoComponent },
    { path: 'resultados', component: ResultadosComponent },
    ];  