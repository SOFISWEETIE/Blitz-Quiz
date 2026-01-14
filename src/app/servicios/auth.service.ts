import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject, map, switchMap, of } from 'rxjs';
import { inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { runTransaction } from '@angular/fire/firestore';

/**
 * Servicio principal de autenticación con Firebase.
 * Maneja login/logout con Google, estado del usuario, alias + mascota,
 * y asegura unicidad de alias con transacción en Firestore.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router = inject(Router);

  /** Observable del usuario actual de Firebase (null si no logueado) */
  user$ = new BehaviorSubject<User | null>(null);

  alias$ = new BehaviorSubject<{ alias: string; mascota: string } | null>(null);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.user$.next(user);

      if (user) {
        this.loadAlias(user.uid);
        this.alias$.next(null);
      }
    });
  }

  /**
   * Inicia sesión con Google.
   * Después redirige a modos si ya tiene alias, o a crear-alias si no.
   */
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    const cred = await signInWithPopup(this.auth, provider);
    const uid = cred.user.uid;

    const tieneAlias = await this.comprobarAlias(uid);

    if (tieneAlias) {
      await this.router.navigate(['/app/modos']);
    } else {
      await this.router.navigate(['/app/crear-alias']);
    }
  }
  /**
   * Cierra sesión con Firebase.
   */
  async logout() {
    return signOut(this.auth);
  }

  /**
   * Observable que devuelve el alias actual (o null si no existe).
   * Útil para guards que necesitan verificar si ya tiene alias.
   */
  verificarAlias() {
    return this.alias$.pipe(
      switchMap(data => of(data?.alias || null))
    );
  }

  /**
   * Carga el alias y mascota del usuario desde Firestore.
   * Actualiza alias$ con los datos o null si no existe.
   * @param uid ID del usuario en Firebase
   */
  /**
   * Comprueba si el usuario ya tiene alias guardado en Firestore.
   * @param uid ID del usuario
   * @returns Promise<boolean> true si existe alias
   */
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

  /**
   * Comprueba si el usuario ya tiene alias guardado en Firestore.
   * @param uid ID del usuario
   * @returns Promise<boolean> true si existe alias
   */
  async comprobarAlias(uid: string): Promise<boolean> {
    const ref = doc(this.firestore, 'usuarios', uid);
    const snap = await getDoc(ref);
    return snap.exists() && !!snap.data()?.['alias'];
  }

  /**
   * Guarda alias y mascota de forma segura y única.
   * Usa transacción para evitar que dos usuarios cojan el mismo alias al mismo tiempo.
   * Si el alias ya existe → lanza error 'ALIAS_EXISTE'.
   * Actualiza alias$ al finalizar.
   * @param uid ID del usuario
   * @param data { alias, mascota }
   */
  async guardarAliasUnico(uid: string, data: { alias: string; mascota: string }) {

    const alias = data.alias;

    const aliasRef = doc(this.firestore, 'aliases', alias);
    const userRef = doc(this.firestore, 'usuarios', uid);

    return runTransaction(this.firestore, async (transaction) => {
      const aliasSnap = await transaction.get(aliasRef);

      if (aliasSnap.exists()) {
        throw new Error('ALIAS_EXISTE');
      }

      transaction.set(aliasRef, { uid });

      transaction.set(userRef, { alias, mascota: data.mascota }, { merge: true });
    }).then(() => {
      this.alias$.next(data);
    });
  }

}
