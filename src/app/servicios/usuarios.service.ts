import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

export interface Usuario {
  nombre_usuario: string;
  rol: 'admin' | 'jugador';
  puntuacion: number;
  fecha_registro: any;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  constructor(private firestore: AngularFirestore) {}

  crearUsuario(uid: string, usuario: Usuario): Promise<void> {
    return this.firestore.collection('usuarios').doc(uid).set(usuario, { merge: true });
  }
}
