import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeleccionService } from '../../servicios/seleccion.service';
import { PuntuacionService } from '../../servicios/puntuacion.service';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados.component.html'
})
export class ResultadosComponent {
  constructor(
    public seleccion: SeleccionService,
    public puntuacion: PuntuacionService,
    private router: Router,
    private auth: AuthService
  ) {}

  volverAJugar() {
    this.router.navigate(['/modos']);
  }

  async logout() {
  await this.auth.logout();
  await this.router.navigate(['/login']);
}
}