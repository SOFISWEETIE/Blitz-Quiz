import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

/**
 * Servicio que carga y filtra las preguntas desde el archivo JSON local.
 * Por ahora todo desde assets/preguntas.json (fácil para desarrollo),
 * más adelante se puede cambiar a Firebase sin romper el resto.
 */
@Injectable({
  providedIn: 'root'
})
export class PreguntasService {
  constructor(private http: HttpClient) {}

  
  /**
   * Carga preguntas según categoría y dificultad desde el JSON.
   * Devuelve un array de preguntas.
   * Lanza error si la categoría o dificultad no existen.
   * @param categoria Nombre de la categoría (ej: 'Arte', 'Ciencia')
   * @param dificultad Nivel (ej: 'facil', 'media', 'dificil')
   * @returns Promise con array de preguntas
   */
  async obtenerPreguntas(categoria: string, dificultad: string): Promise<any[]> {
    
    const data: any = await firstValueFrom(
      this.http.get('assets/preguntas.json')
    );

    const cat = data[categoria];
    if (!cat) {
      throw new Error(`Categoría no encontrada: ${categoria}`);
    }

    const difKey = dificultad.toLowerCase(); 
    const dif = cat[difKey];
    if (!dif) {
      throw new Error(`Dificultad no encontrada: ${dificultad}`);
    }
    return [...dif];
  }
}
