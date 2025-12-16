import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, collection, query, orderBy, limit, serverTimestamp } from '@angular/fire/firestore';
import { collectionData } from 'rxfire/firestore';


@Injectable({
  providedIn: 'root'
})
export class ServicioRanking {
  constructor(private firestore: Firestore) {}

  // Guarda la puntuacion semanal de un jugador
  async guardarPuntuacionSemanal(
    idSemana: string,
    idJugador: string,
    nombreJugador: string,
    puntos: number,
    mascota: string
  ) {
    // mira si la semana existe
    const refSemana = doc(this.firestore, `intentos/${idSemana}`);
    await setDoc(
      refSemana,
      {
        año: new Date().getFullYear(),
        semana: Number(idSemana.split('_').pop()),
        fecha_inicio: serverTimestamp()
      },
      { merge: true } 
    );

    const refPuntuacion = doc(
      this.firestore,
      `intentos/${idSemana}/puntuaciones/${idJugador}`
    );

    await setDoc(refPuntuacion, {
      jugador: nombreJugador,
      puntuacion: puntos,
      mascota: mascota,
      fecha: serverTimestamp()
    });
  }


  //ranking semanal (top 10)
  obtenerRankingSemanal(idSemana: string) {
    const referencia = collection(
      this.firestore,
      `intentos/${idSemana}/puntuaciones`
    );

    const consulta = query(
      referencia,
      orderBy('puntuacion', 'desc'),
      limit(10)
    );
    return collectionData(consulta, { idField: 'id' });
  }
}
