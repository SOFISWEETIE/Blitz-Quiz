import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  constructor(public auth: AuthService, private router: Router) {}

  //metodo para cerrar sesion
  async salir() {
    await this.auth.logout();               // cierra sesion en Firebase
    await this.router.navigate(['/login']);  // redirige al login
  }

}

