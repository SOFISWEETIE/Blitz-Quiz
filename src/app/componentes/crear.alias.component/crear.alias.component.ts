import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';


@Component({
  selector: 'app-crear-alias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear.alias.component.html',
  styleUrls: ['./crear.alias.component.css']
})
export class CrearAliasComponent {

  alias = '';

  mascotas = [
  { src: 'assets/mascotas/caballo.png', nombre: 'Caballo' },
  { src: 'assets/mascotas/mapache.png', nombre: 'Mapache' },
  { src: 'assets/mascotas/conejo.jpg', nombre: 'Conejo' },
  { src: 'assets/mascotas/tigre.jpg', nombre: 'Tigre' },
  { src: 'assets/mascotas/pinguino.jpg', nombre: 'Jirafa' },
  { src: 'assets/mascotas/zorro.jpg', nombre: 'Zorro' },
  { src: 'assets/mascotas/gallina.jpg', nombre: 'Gallina' },
  { src: 'assets/mascotas/oso.jpg', nombre: 'Oso' },
  { src: 'assets/mascotas/perro.jpg', nombre: 'Perro' },
  { src: 'assets/mascotas/gato.jpg', nombre: 'Gato' },
  { src: 'assets/mascotas/cerdo3.jpg', nombre: 'Cerdo' },
  { src: 'assets/mascotas/serpiente.jpg', nombre: 'serpiente' },
];

mascotaSeleccionada = this.mascotas[0].src;

  constructor(private auth: AuthService, private router: Router) {}

  async guardar() {

  const aliasLimpio = this.alias.trim().toLowerCase();

  if (aliasLimpio.length < 3) {
    alert('El alias debe tener al menos 3 caracteres');
    return;
  }

  this.auth.user$.pipe(take(1)).subscribe(async user => {
    if (!user) return;

    try {
      await this.auth.guardarAliasUnico(user.uid, {
        alias: aliasLimpio,
        mascota: this.mascotaSeleccionada
      });

      await this.router.navigate(['/app/modos']);

    } catch (e: any) {
      if (e.message === 'ALIAS_EXISTE') {
        alert('Ese alias ya está en uso, escribe uno diferente');
      } else {
        alert('Error al guardar alias');
        console.error(e);
      }
    }
  });
}

  volverAtras() {
  this.router.navigate(['/app/modos']);
}

}



