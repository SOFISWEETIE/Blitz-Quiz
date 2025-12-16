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

  constructor(private auth: AuthService, private router: Router) { }

  async login() {
    this.loading = true;
    try {
      await this.auth.loginWithGoogle();
      this.error = null;
      
    } catch (err) {
      console.error('Error login:', err);
      this.error = (err as any)?.message || String(err);
    } finally {
      this.loading = false; // permite intentar inicio de sesión otra vez
    }
  }
}