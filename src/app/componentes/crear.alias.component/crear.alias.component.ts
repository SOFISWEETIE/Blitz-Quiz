import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';

/* Componente responsable de la creación y configuración del alias de usuario */
@Component({
  selector: 'app-crear-alias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear.alias.component.html',
  styleUrls: ['./crear.alias.component.css']
})
export class CrearAliasComponent {

  /* Valor actual del alias ingresado por el usuario */
  alias = '';

  /* Lista de mascotas disponibles para seleccionar */
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

  /* Mascota actualmente seleccionada, inicializada con la primera opción */
  mascotaSeleccionada = this.mascotas[0].src;

  /* Inyección de dependencias: servicio de autenticación y enrutador de Angular */
  constructor(private auth: AuthService, private router: Router) { }

  /**
  * Guarda el alias y la mascota seleccionada en el perfil del usuario
  * Realiza validaciones sobre longitud del alias y unicidad en la base de datos
  */
  async guardar() {

    /* Normaliza el alias: elimina espacios y convierte a minúsculas */
    const aliasLimpio = this.alias.trim().toLowerCase();

    /* Validación de longitud mínima y máxima */
    if (aliasLimpio.length < 3 || aliasLimpio.length > 20) {
      alert('El alias debe tener al menos 3 caracteres y no más de 20');
      return;
    }

    /* Suscripción temporal al observable del usuario actual */
    this.auth.user$.pipe(take(1)).subscribe(async user => {
      if (!user) return;

      try {

        /* Guardado del alias y mascota en el perfil del usuario */
        await this.auth.guardarAliasUnico(user.uid, {
          alias: aliasLimpio,
          mascota: this.mascotaSeleccionada
        });

        /* Navegación hacia la sección de modos de juego tras guardar exitosamente */
        await this.router.navigate(['/app/modos']);

      } catch (e: any) {
        /* Manejo de errores: alias existente o error general */
        if (e.message === 'ALIAS_EXISTE') {
          alert('Ese alias ya está en uso, escribe uno diferente');
        } else {
          alert('Error al guardar alias');
          console.error(e);
        }
      }
    });
  }

  /** Permite volver a la pantalla anterior sin guardar cambios */
  volverAtras() {
    this.router.navigate(['/app/modos']);
  }

}




