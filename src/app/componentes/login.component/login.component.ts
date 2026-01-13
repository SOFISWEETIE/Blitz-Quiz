import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

/**
 * Componente principal de la pantalla de login.
 * Gestiona el inicio de sesión con Google a través de Firebase Authentication,
 * muestra un modal de consentimiento previo al login,
 * maneja estados de carga y errores, y proporciona feedback al usuario.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  /**
   * Flag que indica si hay una operación de autenticación en curso.
   * Se usa para deshabilitar botones y mostrar "Cargando..." en el modal.
   */
  loading = false;

  /**
   * Mensaje de error a mostrar en la interfaz.
   * Puede ser null (sin error) o un string con la descripción del problema.
   */
  error: string | null = null;

  /**
   * Controla la visibilidad del modal de consentimiento antes de iniciar el login.
   * true → muestra el modal; false → lo oculta.
   */
  mostrarDialogo = false;  

  /**
   * Constructor del componente.
   * Inyecta los servicios necesarios para autenticación y navegación.
   * 
   * @param auth Servicio personalizado que encapsula la lógica de Firebase Auth
   * @param router Servicio nativo de Angular para manejar la navegación entre rutas
   */
  constructor(private auth: AuthService, private router: Router) { }

  /**
   * Abre el modal de consentimiento cuando el usuario pulsa el botón "Registrate con Google".
   * No inicia el login hasta que se acepte explícitamente.
   */
  abrirDialogo() {
    this.mostrarDialogo = true;
  }

  async confirmarAceptar() {
    this.mostrarDialogo = false;
    await this.ejecutarLogin();
  }

  cancelarDialogo() {
    this.mostrarDialogo = false;
  }

  /**
   * Método privado que realiza el proceso real de autenticación con Google.
   * Gestiona el estado de loading, captura errores y limpia el estado al finalizar. 
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