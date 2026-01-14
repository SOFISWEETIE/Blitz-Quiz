import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { AuthService } from '../servicios/auth.service';
import { BehaviorSubject } from 'rxjs';

/**
 * Servicio que maneja los logros del usuario.
 * Inicializa el estado si no existe, carga/desbloquea logros en Firestore,
 * y emite cambios en tiempo real con BehaviorSubject para notificaciones.
 */
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

  /**
   * Inicializa los logros del usuario si no existen.
   * Crea un documento con todos en false, o carga los existentes.
   */
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

  /**
     * Obtiene el estado actual de logros desde Firestore.
     * Actualiza el observable y devuelve los datos.
     * @returns Promise con el mapa de logros
     */
  async obtenerLogros(): Promise<Record<string, boolean>> {
    if (!this.ref) return {};
    const snap = await getDoc(this.ref);
    const data = snap.exists() ? snap.data() as any : {};
    this.logros$.next(data);
    return data;
  }

  /**
   * Desbloquea un logro específico si no estaba ya desbloqueado.
   * Actualiza Firestore con merge y refresca el observable.
   * @param id ID del logro a desbloquear (ej: 'primerJuego')
   * @returns Promise con el ID (para mostrar notificación)
   */
  async desbloquear(id: string): Promise<string> {
    if (!this.ref) return id;

    const snap = await getDoc(this.ref);
    if (snap.exists() && snap.data()?.[id]) return id;

    console.log('Desbloqueando logro:', id);
    await setDoc(this.ref, { [id]: true }, { merge: true });

    const newData = snap.exists() ? { ...snap.data(), [id]: true } : { [id]: true };
    this.logros$.next(newData);
    return id;
  }
}
