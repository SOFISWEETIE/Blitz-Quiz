import { Routes } from '@angular/router';
import { LoginComponente } from './login/login.componente';
import { PreguntasListaComponente } from './componentes/preguntas-lista.componente/preguntas-lista.componente';
import { authGuard } from './servicios/auth.guard';

export const routes: Routes = [
	{ path: '', redirectTo: 'preguntas', pathMatch: 'full' },
	{ path: 'login', component: LoginComponente },
	{ path: 'preguntas', component: PreguntasListaComponente, canActivate: [authGuard] }
];
