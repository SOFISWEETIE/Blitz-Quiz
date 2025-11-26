import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,                // necesario para usar imports
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'] // plural y en array
})
export class App {
  // Título de la app usando signal
  readonly title = signal('Blitz-Quiz');
}

