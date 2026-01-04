import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loading = false;
  error: string | null = null;
  mostrarDialogo = false;  // <<-- NUEVO: controla el modal

  constructor(private auth: AuthService, private router: Router) { }

  // Al pulsar el botón grande mostramos el dialog primero
  abrirDialogo() {
    this.mostrarDialogo = true;
  }

  // Si acepta en el dialog → login real
  async confirmarAceptar() {
    this.mostrarDialogo = false;
    await this.ejecutarLogin();
  }

  // Si cancela → cierra dialog y se queda en login
  cancelarDialogo() {
    this.mostrarDialogo = false;
  }

  // El login real (lo que antes tenías en login())
  private async ejecutarLogin() {
    this.loading = true;
    try {
      await this.auth.loginWithGoogle();
      this.error = null;
    } catch (err) {
      console.error('Error login:', err);
      this.error = (err as any)?.message || String(err);
    } finally {
      this.loading = false;
    }
  }
}