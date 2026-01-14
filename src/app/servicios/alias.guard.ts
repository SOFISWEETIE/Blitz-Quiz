import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { map } from 'rxjs/operators';

/**
 * Guard que protege rutas que requieren que el usuario ya tenga alias configurado.
 * Si no tiene alias → redirige a /app/crear-alias.
 * Si ya tiene alias → deja pasar (true).
 */
@Injectable({
  providedIn: 'root'
})
export class AliasGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  /**
   * Método principal del guard: comprueba si el usuario tiene alias.
   * Devuelve Observable<boolean>: true = pasa, false = redirige.
   * Usa verificarAlias() del AuthService y map para decidir.
   */
  canActivate() {
    return this.auth.verificarAlias().pipe(
      map(alias => {
        if (alias) return true;

        this.router.navigate(['/app/crear-alias']);
        return false;
      })
    );
  }
}
