import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

/**
 * Guard funcional que protege rutas que requieren usuario autenticado.
 * Si hay usuario logueado → pasa (true).
 * Si no → redirige a /login.
 * Usa inject() y CanActivateFn (.
 */
export const authGuard: CanActivateFn = () => {
  // Inyecta servicios sin constructor
  const auth = inject(AuthService);
  const router = inject(Router);

  // Devuelve observable: transforma user$ en boolean o UrlTree para redirigir
  return auth.user$.pipe(
    map(user => {
      // Si existe usuario → permite entrar a la ruta
      if (user) {
        return true;
      }

      // Si no está logueado → redirige a login (parseUrl para que sea UrlTree)
      return router.parseUrl('/login');
    })
  );
};