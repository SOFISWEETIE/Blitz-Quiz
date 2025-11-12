import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PreguntasListaComponente } from './componentes/preguntas-lista.componente/preguntas-lista.componente';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PreguntasListaComponente],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
protected readonly title = signal('Blitz-Quiz');
}