import { Injectable, inject } from '@angular/core'
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from '@angular/fire/auth'
import { BehaviorSubject, of, switchMap } from 'rxjs'
import {
  Firestore,
  doc,
  getDoc,
  runTransaction
} from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth)
  private firestore: Firestore = inject(Firestore)

  user$ = new BehaviorSubject<User | null>(null)
  alias$ = new BehaviorSubject<{ alias: string; mascota: string } | null>(null)

  redirectUrl: string | null = null

  constructor() {
    onAuthStateChanged(this.auth, async user => {
      this.user$.next(user)

      if (user) {
        await this.loadAlias(user.uid)
      } else {
        this.alias$.next(null)
      }
    })
  }

  isLoggedIn() {
    return !!this.user$.value
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    await signInWithPopup(this.auth, provider)
  }

  async logout() {
    await signOut(this.auth)
    this.user$.next(null)
    this.alias$.next(null)
    this.redirectUrl = null
  }

  verificarAlias() {
    return this.alias$.pipe(
      switchMap(data => of(data?.alias || null))
    )
  }

  async loadAlias(uid: string) {
    const ref = doc(this.firestore, 'usuarios', uid)
    const snap = await getDoc(ref)

    if (snap.exists()) {
      const data = snap.data() as { alias?: string; mascota?: string }
      this.alias$.next({
        alias: data.alias || '',
        mascota: data.mascota || ''
      })
    } else {
      this.alias$.next(null)
    }
  }

  async comprobarAlias(uid: string): Promise<boolean> {
    const ref = doc(this.firestore, 'usuarios', uid)
    const snap = await getDoc(ref)
    return snap.exists() && !!snap.data()?.['alias']
  }

  async guardarAliasUnico(uid: string, data: { alias: string; mascota: string }) {
    const alias = data.alias
    const aliasRef = doc(this.firestore, 'aliases', alias)
    const userRef = doc(this.firestore, 'usuarios', uid)

    await runTransaction(this.firestore, async transaction => {
      const aliasSnap = await transaction.get(aliasRef)

      if (aliasSnap.exists()) {
        throw new Error('ALIAS_EXISTE')
      }

      transaction.set(aliasRef, { uid })
      transaction.set(userRef, { alias, mascota: data.mascota }, { merge: true })
    })

    this.alias$.next(data)
  }
}