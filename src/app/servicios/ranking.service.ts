import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, collection, query, orderBy, limit, serverTimestamp, increment } from '@angular/fire/firestore';
import { collectionData } from 'rxfire/firestore';

/**
 * Servicio que maneja el ranking semanal en Firestore.
 * Guarda/suma puntos por jugador en la semana actual,
 * crea la semana si no existe y devuelve el top 10 ordenado por puntuación descendente.
 */
@Injectable({
  providedIn: 'root'
})
export class ServicioRanking {
  constructor(private firestore: Firestore) {}

  /**
   * Guarda o suma la puntuación de un jugador en la semana indicada.
   * Crea el documento de la semana si no existe.
   * Usa increment para sumar puntos si el jugador ya jugó esa semana.
   * Guarda también mascota y timestamp para posibles futuras features.
   * @param idSemana ID de la semana (ej: "2026_semana_3")
   * @param idJugador UID del usuario
   * @param nombreJugador Alias del jugador
   * @param puntos Puntos a sumar en esta partida
   * @param mascota URL o ID de la mascota elegida
   */
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

  /**
   * Devuelve observable del top 10 jugadores de la semana (orden descendente por puntos).
   * Usa rxfire collectionData para suscribirse en tiempo real.
   * @param idSemana ID de la semana a consultar
   * @returns Observable con array de jugadores (incluye idField 'id')
   */
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
