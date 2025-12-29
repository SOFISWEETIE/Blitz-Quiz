// src/app/servicios/auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject, map, switchMap, of } from 'rxjs';
import { inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { runTransaction } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);  // ← INYECTAMOS CON inject() EN VEZ DE CONSTRUCTOR
  private firestore: Firestore = inject(Firestore); 
  private router = inject(Router);

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

  const cred = await signInWithPopup(this.auth, provider);
  const uid = cred.user.uid;

  // esto comprueba si ya tiene un alias para ir al juego directamente o crearlo
  const tieneAlias = await this.comprobarAlias(uid);

  if (tieneAlias) {
    // si ya tiene alias - ir a modos
    await this.router.navigate(['/app/modos']);
  } else {
    //  Si no lo tiene - ir a crear alias
    await this.router.navigate(['/app/crear-alias']);
  }
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

  // Comprueba si el usuario tiene alias
  async comprobarAlias(uid: string): Promise<boolean> {
  const ref = doc(this.firestore, 'usuarios', uid);
  const snap = await getDoc(ref);
  return snap.exists() && !!snap.data()?.['alias'];
  }


  async guardarAliasUnico(uid: string, data: { alias: string; mascota: string }) {
    
  const alias = data.alias;

  const aliasRef = doc(this.firestore, 'aliases', alias);
  const userRef  = doc(this.firestore, 'usuarios', uid);

  return runTransaction(this.firestore, async (transaction) => {
  const aliasSnap = await transaction.get(aliasRef);

    if (aliasSnap.exists()) {
      throw new Error('ALIAS_EXISTE');
    }

    // Reservar alias
    transaction.set(aliasRef, { uid });

    // Guardar usuario
    transaction.set(userRef, { alias, mascota: data.mascota }, { merge: true });
  }).then(() => {
    this.alias$.next(data);
  });
}

}
