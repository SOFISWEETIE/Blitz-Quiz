import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, collection, query, orderBy, limit, serverTimestamp, increment } from '@angular/fire/firestore';
import { collectionData } from 'rxfire/firestore';
import { increment } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ServicioRanking {
  constructor(private firestore: Firestore) {}

  
  async guardarPuntuacionSemanal(
    idSemana: string,
    idJugador: string,
    nombreJugador: string,
    puntos: number,
    mascota: string
  ) {
    
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
      puntuacion: increment(puntos),  
      mascota: mascota,
      fecha: serverTimestamp() 
    }, { merge: true }); 

    console.log('Puntos sumados al acumulado semanal:', puntos);
  }

 
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