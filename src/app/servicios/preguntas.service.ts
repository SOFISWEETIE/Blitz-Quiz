import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import { Firestore, doc, getDoc } from '@angular/fire/firestore'
import {  runInInjectionContext } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class PreguntasService {
  private firestore: Firestore = inject(Firestore)

  constructor(private http: HttpClient) {}

  async obtenerPreguntas(categoria: string, dificultad: string): Promise<any[]> {
    const data: any = await firstValueFrom(
      this.http.get('assets/preguntas.json')
    )

    const cat = data[categoria]
    if (!cat) {
      throw new Error(`Categoría no encontrada: ${categoria}`)
    }

    const difKey = dificultad.toLowerCase()
    const dif = cat[difKey]
    if (!dif) {
      throw new Error(`Dificultad no encontrada: ${dificultad}`)
    }

    return [...dif]
  }

    async obtenerPreguntasCuestionario(cuestionarioId: string): Promise<any[]> {
    return runInInjectionContext(this.firestore as any, async () => {
      const ref = doc(this.firestore, 'cuestionarios', cuestionarioId)
      const snap = await getDoc(ref)

      if (!snap.exists()) {
        return []
      }

      return snap.data()?.['preguntas'] || []
    })
  }
}