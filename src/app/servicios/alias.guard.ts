import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AliasGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

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
