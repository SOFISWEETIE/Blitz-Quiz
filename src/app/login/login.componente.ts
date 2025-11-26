import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthServicio } from '../servicios/auth.servicio';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.componente.html',
  styleUrls: ['./login.componente.css']
})
export class LoginComponente {
  loading = false;
  error: string | null = null;

  constructor(private auth: AuthServicio, private router: Router) { }

  async login() {
    this.loading = true;
    try {
      await this.auth.loginWithGoogle();
      this.error = null;
      // Navega a la pantalla de preguntas después de iniciar sesión para poder jugar al juego
      await this.router.navigate(['/modos']);
    } catch (err) {
      console.error('Error login:', err);
      this.error = (err as any)?.message || String(err);
    } finally {
      this.loading = false; // permite intentar inicio de sesión otra vez
    }
  }
}
