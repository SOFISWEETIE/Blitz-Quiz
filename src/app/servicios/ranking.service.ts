import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, collection, query, orderBy, limit } from '@angular/fire/firestore';
import { collectionData } from 'rxfire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ServicioRanking {
  constructor(private firestore: Firestore) {}

  // Guarda la puntuacion semanal de un jugador
  async guardarPuntuacionSemanal(idSemana: string, idJugador: string, nombreJugador: string, puntos: number) {
    const referencia = doc(this.firestore, `intentos/${idSemana}/puntuaciones/${idJugador}`);
    await setDoc(referencia, {
      jugador: nombreJugador,
      puntuacion: puntos,
      fecha: new Date()
    });
  }

  // trae el ranking semanal ordenado por puntuacion descendente
  obtenerRankingSemanal(idSemana: string) {
    const referencia = collection(this.firestore, `intentos/${idSemana}/puntuaciones`);
    const consulta = query(referencia, orderBy('puntuacion', 'desc'), limit(10));
    return collectionData(consulta, { idField: 'id' });
  }
}
