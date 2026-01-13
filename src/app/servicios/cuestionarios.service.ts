import { Injectable, inject } from '@angular/core'
import { Firestore, collection, addDoc, query, where, collectionData, doc, updateDoc, deleteDoc, serverTimestamp } from '@angular/fire/firestore'
import { Auth, authState } from '@angular/fire/auth'
import { Observable, switchMap, of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class CuestionariosService {

  private firestore = inject(Firestore)
  private auth = inject(Auth)

  private colRef = collection(this.firestore, 'cuestionarios')

  obtenerMisCuestionarios(): Observable<any[]> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (!user) return of([])
        const q = query(this.colRef, where('uid', '==', user.uid))
        return collectionData(q, { idField: 'id' })
      })
    )
  }

  crearCuestionario(data: any) {
    const user = this.auth.currentUser
    if (!user) throw new Error('NO_AUTH')

    return addDoc(this.colRef, {
      ...data,
      uid: user.uid,
      alias: user.displayName || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  }

  actualizarCuestionario(id: string, data: any) {
    const ref = doc(this.firestore, 'cuestionarios', id)
    return updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp()
    })
  }

  eliminarCuestionario(id: string) {
    const ref = doc(this.firestore, 'cuestionarios', id)
    return deleteDoc(ref)
  }
}