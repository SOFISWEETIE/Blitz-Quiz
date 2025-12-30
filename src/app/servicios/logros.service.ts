import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { AuthService } from '../servicios/auth.service';

import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LogrosService {

  private firestore = inject(Firestore);
  private auth = inject(AuthService);

  private logros$ = new BehaviorSubject<Record<string, boolean>>({});
  estado$ = this.logros$.asObservable();


  private uid?: string;

  constructor() {
    
    this.auth.user$.subscribe(user => {
      this.uid = user?.uid;
      if (this.uid) this.obtenerLogros();
    });
  }

  private get ref() {
    return this.uid ? doc(this.firestore, `usuarios/${this.uid}/logros/estado`) : null;
  }

  async inicializarLogros() {
  if (!this.ref) return;

  const snap = await getDoc(this.ref);
  if (!snap.exists()) {
    const inicial = {
      primerJuego: false,
      primerAcierto: false,
      clasicoIniciado: false,
      blitzValiente: false,
      rachaCinco: false,
      blitzRapido: false,
      puntos500: false,
      multiModo: false,
      rachaDiez: false,
      blitzSobreviviente: false,
      partidasDiez: false,
      rachaPerfectaClasico: false,
      blitzPerfecto: false,
      puntos1500: false,
      partidasCincuenta: false,
      blitzMaraton: false
      
    };
    await setDoc(this.ref, inicial);
    this.logros$.next(inicial);
  } else {
    this.logros$.next(snap.data() as any);
  }
}

  async obtenerLogros(): Promise<Record<string, boolean>> {
    if (!this.ref) return {};
    const snap = await getDoc(this.ref);
    const data = snap.exists() ? snap.data() as any : {};
    this.logros$.next(data);
    return data;
  }

  async desbloquear(id: string) {
    if (!this.ref) return;

    const snap = await getDoc(this.ref);
    if (snap.exists() && snap.data()?.[id]) return;

    console.log('Desbloqueando logro:', id);

    await setDoc(this.ref, { [id]: true }, { merge: true });

    
    const newData = snap.exists() ? { ...snap.data(), [id]: true } : { [id]: true };
    this.logros$.next(newData);
  }
}
