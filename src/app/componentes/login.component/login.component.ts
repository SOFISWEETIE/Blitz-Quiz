import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { gsap } from 'gsap';

/* Componente responsable de la gestión de la vista de autenticación */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  /* Indica si el proceso de autenticación está en curso */
  loading = false;

  /* Almacena el mensaje de error en caso de fallo */
  error: string | null = null;

  /* Controla la visualización del modal de confirmación */
  mostrarDialogo = false; 

  /* Inyección de dependencias: servicio de autenticación y enrutador */
  constructor(private auth: AuthService, private router: Router) { }

  /* Abre el diálogo de confirmación antes de iniciar el login */
  abrirDialogo() {
    this.mostrarDialogo = true;
  }

  /* Confirma el consentimiento y ejecuta el proceso de autenticación */
  async confirmarAceptar() {
    this.mostrarDialogo = false;
    await this.ejecutarLogin();
  }

  /* Cancela el proceso y cierra el diálogo */
  cancelarDialogo() {
    this.mostrarDialogo = false;
  }

  /* Ejecuta el login con Google a través del servicio de autenticación */
  private async ejecutarLogin() {
  this.loading = true
  try {
    await this.auth.loginWithGoogle()
    this.error = null

    const destino = this.auth.redirectUrl || '/app/modos'
    this.auth.redirectUrl = null
    this.router.navigateByUrl(destino)

  } catch (err) {
    console.error('Error login:', err)
    this.error = (err as any)?.message || String(err)
  } finally {
    this.loading = false
  }
}
  /* Inicializa animaciones tras la carga completa de la vista */
  ngAfterViewInit() {

  /* Referencia al logo de la aplicación */
  const logo = document.querySelector('.logo-login');

  /* Animación inicial de entrada del logo */
  gsap.from(".logo-login", { 
    scale: 0.7, 
    opacity: 0, 
    duration: 0.6, 
    ease: "back.out(1.7)" 
  }); 

  /* Efecto visual al pasar el cursor sobre el logo */
  logo?.addEventListener('mouseenter', () => {
    gsap.to(logo, {
      scale: 1.1,
      y: -6,
      duration: 0.25,
      ease: "back.out(2)"
    });
  });

  /* Restauración del estado inicial al retirar el cursor */
  logo?.addEventListener('mouseleave', () => {
    gsap.to(logo, {
      scale: 1,
      y: 0,
      duration: 0.25,
      ease: "back.out(2)"
    });
  });
}




}