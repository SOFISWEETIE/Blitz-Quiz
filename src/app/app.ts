import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Auth, authState } from '@angular/fire/auth';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent  {
  protected readonly title = signal('Blitz-Quiz');

  private auth = inject(Auth);
  constructor() {
    // Suscribirse al estado de autenticación
    authState(this.auth).subscribe(user => {
      console.log('AppComponent authState:', user);
    });
  }
}
