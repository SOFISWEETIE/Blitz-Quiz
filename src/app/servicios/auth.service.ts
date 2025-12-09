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

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.user$.next(user);
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

   verificarAlias() {
    return this.user$.pipe(
      switchMap(user => {
        if (!user) return of(null);

        const ref = doc(this.firestore, 'usuarios', user.uid);
        return getDoc(ref).then(d => d.exists() ? d.data()['alias'] : null);
      })
    );
  }


   guardarAlias(uid: string, alias: string) {
    const ref = doc(this.firestore, 'usuarios', uid);
    return setDoc(ref, { alias }, { merge: true }).then(() => {
      const user = this.user$.value;
      if (user) this.user$.next(user); // forzar la actualización
  });
}


}
