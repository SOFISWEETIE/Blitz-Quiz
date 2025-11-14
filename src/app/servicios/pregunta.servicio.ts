import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Pregunta } from '../modelos/pregunta.modelo';


@Injectable({
  providedIn: 'root'
})
export class PreguntaServicio {

// insertamos firestore
  constructor(private firestore: Firestore) { }

  
  
// rescatamos las preguntas desde las preguntas
  obtenerPreguntas(): Observable<Pregunta[]> {
    const ref = collection(this.firestore, 'preguntas');
  // devuelve el objeto preguntas
    return collectionData(ref, { idField: 'id' }) as Observable<Pregunta[]>;
  }
}