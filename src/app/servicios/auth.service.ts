// src/app/servicios/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, authState, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);  // ← INYECTAMOS CON inject() EN VEZ DE CONSTRUCTOR
  user$ = new BehaviorSubject<User | null>(null);


  constructor() {
  authState(this.auth).subscribe(user => {
    this.user$.next(user);
    console.log("AuthService authState:", user);
  });
}


  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return signInWithPopup(this.auth, provider);
  }

  async logout() {
    return signOut(this.auth);
  }
}