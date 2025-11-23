import { Injectable } from '@angular/core';
import { Pregunta } from '../modelos/pregunta.model';

@Injectable({
  providedIn: 'root'
})
export class PreguntasService {

  private preguntasJson: any = null;

  async cargarPreguntas(): Promise<void> {
    if (!this.preguntasJson) {
      
      const respuesta = await fetch('/preguntas.json');  
      if (!respuesta.ok) {
        throw new Error('No se pudo cargar el JSON. ¿Está en la carpeta public?');
      }
      this.preguntasJson = await respuesta.json();
    }
  }

  async obtenerPreguntas(categoria: string, dificultad: string): Promise<Pregunta[]> {
    await this.cargarPreguntas();
    return this.preguntasJson[categoria][dificultad] as Pregunta[];
  }

  
  async obtenerTodasLasPreguntas(): Promise<Pregunta[]> {
    await this.cargarPreguntas();
    const todas: Pregunta[] = [];

  // 
  for (const categoria in this.preguntasJson) {
    for (const dificultad of ['facil', 'media', 'dificil']) {
      const preguntas = this.preguntasJson[categoria][dificultad] || [];
      todas.push(...preguntas);
    }
  }

  // Mezclamos las preguntas antes de devolverlas
  return todas.sort(() => Math.random() - 0.5);
  }


  async obtenerCategorias(): Promise<string[]> {
    await this.cargarPreguntas();
    return Object.keys(this.preguntasJson);   
  }
}