import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

/**
 * Interfaz del documento de usuario en Firestore.
 * Guarda nombre de usuario (alias), rol, puntuación total y fecha de registro.
 */
export interface Usuario {
  nombre_usuario: string;
  rol: 'admin' | 'jugador';
  puntuacion: number;
  fecha_registro: any;
}

/**
 * Servicio que crea y gestiona documentos de usuarios en Firestore.
 * Solo crea el usuario inicial al registrarse.
 */
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  constructor(private firestore: AngularFirestore) {}

  crearUsuario(uid: string, usuario: Usuario): Promise<void> {
    return this.firestore.collection('usuarios').doc(uid).set(usuario, { merge: true });
  }
}
