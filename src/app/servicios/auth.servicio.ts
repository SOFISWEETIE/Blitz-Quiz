import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServicio {
  user$ = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth) {
    // escucha cambios de estado de autenticación
    onAuthStateChanged(this.auth, (user) => {
      this.user$.next(user);
    });
  }

  // inicia sesión con Google mediante popup
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    // Forzar que el selector de cuenta de Google pida elegir cuenta
    // así el usuario puede seleccionar otra cuenta incluso si ya había iniciado sesión antes
    provider.setCustomParameters({ prompt: 'select_account' });
    return signInWithPopup(this.auth, provider);
  }

  // cerrar sesión
  async logout() {
    return signOut(this.auth);
  }
}
