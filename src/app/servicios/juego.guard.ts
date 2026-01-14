import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

/**
 * Interfaz que deben implementar los componentes que quieran ser protegidos contra salida accidental.
 * Devuelve true (puedes salir) o Promise<boolean> (espera confirmación del usuario).
 */
export interface JuegoGuard {
    puedeSalir(): boolean | Promise<boolean>;
}

/**
 * Servicio que implementa CanDeactivate para proteger rutas de juego.
 * Cuando intentas salir de un componente que implementa JuegoGuard,
 * llama a su método puedeSalir() y espera su respuesta (sync o async).
 * Si devuelve false → bloquea la navegación (muestra modal en el componente).
 */
@Injectable({
providedIn: 'root'
})
export class JuegoGuardService implements CanDeactivate<JuegoGuard> {
    /**
   * Método principal del guard: decide si se puede desactivar (salir) del componente.
   * Delega la decisión al componente a través de su método puedeSalir().
   * @param component El componente actual que implementa JuegoGuard
   * @returns boolean | Promise<boolean> true = deja salir, false = bloquea
   */
    canDeactivate(component: JuegoGuard): Promise<boolean> | boolean {
    return component.puedeSalir();
    }
}
