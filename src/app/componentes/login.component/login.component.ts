import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

/**
 * Componente de login principal de la aplicación.
 * Maneja el inicio de sesión con Google mediante Firebase Auth,
 * muestra un modal de consentimiento antes de proceder y gestiona estados de carga/error.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  /** Indica si hay una operación de login en curso */
  loading = false;

  /** Mensaje de error a mostrar al usuario (null si no hay error) */
  error: string | null = null;
  /** Controla la visibilidad del modal de consentimiento antes del login con Google */
  mostrarDialogo = false; 

  /**
   * Constructor del componente.
   * Inyecta el servicio de autenticación y el Router para redirección post-login.
   * @param auth Servicio que maneja la autenticación con Firebase (loginWithGoogle)
   * @param router Servicio de Angular para navegar tras login exitoso
   */
  constructor(private auth: AuthService, private router: Router) { }

  /**
   * Abre el modal de consentimiento al hacer clic en el botón "Registrate con Google".
   * No inicia el login hasta que el usuario acepte explícitamente.
   */
  abrirDialogo() {
    this.mostrarDialogo = true;
  }

  /**
   * Acción al aceptar el modal: cierra el diálogo y ejecuta el login real con Google.
   */
  async confirmarAceptar() {
    this.mostrarDialogo = false;
    await this.ejecutarLogin();
  }

  /**
   * Acción al cancelar el modal: simplemente cierra el diálogo sin hacer login.
   */
  cancelarDialogo() {
    this.mostrarDialogo = false;
  }

  /**
   * Método privado que realiza el login real con Google a través del AuthService.
   * Gestiona estados de loading, errores y éxito.
   */
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