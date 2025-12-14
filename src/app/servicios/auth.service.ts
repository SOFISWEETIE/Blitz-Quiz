// src/app/servicios/auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject, map, switchMap, of } from 'rxjs';
import { inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);  // ← INYECTAMOS CON inject() EN VEZ DE CONSTRUCTOR
  private firestore: Firestore = inject(Firestore); 
  user$ = new BehaviorSubject<User | null>(null);

  // Observable para alias y mascota
  alias$ = new BehaviorSubject<{ alias: string; mascota: string } | null>(null);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.user$.next(user);

      if (user) {
        this.loadAlias(user.uid); // cargar alias y mascota
      } else {
        this.alias$.next(null);
      }
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

  // Verificar solo alias
  verificarAlias() {
    return this.alias$.pipe(
      switchMap(data => of(data?.alias || null))
    );
  }

  // Cargar alias y mascota desde Firestore
  async loadAlias(uid: string) {
    const ref = doc(this.firestore, 'usuarios', uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as { alias?: string; mascota?: string };
      this.alias$.next({
        alias: data.alias || '',
        mascota: data.mascota || ''
      });
    } else {
      this.alias$.next(null);
    }
  }

  // Guardar alias y mascota y actualizar automáticamente alias$
  guardarAlias(uid: string, data: { alias: string; mascota: string }) {
    const ref = doc(this.firestore, 'usuarios', uid);
    return setDoc(ref, data, { merge: true }).then(() => {
      this.alias$.next(data); 
    });
  }

}
