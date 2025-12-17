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
  { src: 'assets/mascotas/leon.png', nombre: 'Leon' },
  { src: 'assets/mascotas/koala.png', nombre: 'Koala' },
  { src: 'assets/mascotas/tigre.png', nombre: 'Tigre' },
  { src: 'assets/mascotas/jirafa.png', nombre: 'Jirafa' },
  { src: 'assets/mascotas/zorro.png', nombre: 'Zorro' },
  { src: 'assets/mascotas/vaca.png', nombre: 'Vaca' },
  { src: 'assets/mascotas/cerdo.png', nombre: 'Cerdo' },
  { src: 'assets/mascotas/perro.png', nombre: 'Perro' },
  { src: 'assets/mascotas/gato.png', nombre: 'Gato' },
];

mascotaSeleccionada = this.mascotas[0].src;

  constructor(private auth: AuthService, private router: Router) {}

  guardar() {
    if (this.alias.trim().length < 3) {
      alert('El alias debe tener  3 caracteres');
      return;
    }

    this.auth.user$.pipe(take(1)).subscribe(user => {
      if (!user) return;

      this.auth.guardarAlias(user.uid, {
        alias: this.alias,
        mascota: this.mascotaSeleccionada
      })
      .then(() => this.router.navigate(['/app/modos']));
    });
  }
}


