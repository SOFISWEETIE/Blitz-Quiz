import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { gsap } from 'gsap';

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
  mostrarDialogo = false; 

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

  ngAfterViewInit() {
  const logo = document.querySelector('.logo-login');

  // animación inicial 
  gsap.from(".logo-login", { 
    scale: 0.7, 
    opacity: 0, 
    duration: 0.6, 
    ease: "back.out(1.7)" 
  }); 

  //Rebote al pasar el ratón
  logo?.addEventListener('mouseenter', () => {
    gsap.to(logo, {
      scale: 1.1,
      y: -6,
      duration: 0.25,
      ease: "back.out(2)"
    });
  });

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