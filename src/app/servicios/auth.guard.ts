import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthServicio } from './auth.servicio';

/** CanActivateFn que usa `inject` para acceder a AuthServicio y Router. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthServicio);
  const router = inject(Router);
  return auth.user$.pipe(
    map(user => user ? true : router.parseUrl('/login'))
  );
};
