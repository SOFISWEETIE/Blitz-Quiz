import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreguntasService {
  constructor(private http: HttpClient) {}

  
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
