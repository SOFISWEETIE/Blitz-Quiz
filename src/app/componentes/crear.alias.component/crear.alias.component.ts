import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';

/**
 * Componente que permite al usuario crear su alias único y seleccionar una mascota.
 * Se muestra solo después del primer login.
 * Valida longitud y unicidad del alias en Firebase, guarda el perfil y redirige a modos.
 */
@Component({
  selector: 'app-crear-alias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear.alias.component.html',
  styleUrls: ['./crear.alias.component.css']
})
export class CrearAliasComponent {

  /**
   * Valor del alias ingresado por el usuario en el input (binding two-way con ngModel).
   */
  alias = '';

  /**
   * Lista estática de mascotas disponibles para elegir.
   * Cada objeto tiene la ruta de la imagen y el nombre descriptivo.
   */
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

  /**
   * Mascota seleccionada actualmente por el usuario.
   * Inicializada con la primera de la lista (Caballo).
   */
  mascotaSeleccionada = this.mascotas[0].src;

  /** 
   * Constructor del componente.
   * Inyecta el servicio de autenticación y el Router para navegación.
   * 
   * @param auth Servicio que maneja Firebase Auth y operaciones de perfil de usuario
   * @param router Servicio de Angular para redirigir tras guardar el alias
  */  constructor(private auth: AuthService, private router: Router) { }

  /**
  * Guarda el alias y la mascota seleccionada en el perfil del usuario
  * Realiza validaciones sobre longitud del alias y unicidad en la base de datos
  */
  async guardar() {

    // Normaliza el alias: elimina espacios extras y convierte a minúsculas
    const aliasLimpio = this.alias.trim().toLowerCase();

    // Validación básica de longitud (3-20 caracteres)
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

  /**
   * Navega de vuelta a la pantalla de modos sin guardar cambios.
   * Usado en el botón "Volver atrás" o similar.
   */  volverAtras() {
    this.router.navigate(['/app/modos']);
  }

}




