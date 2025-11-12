export interface Respuesta {
  texto: string;
  correcta: boolean;
}

export interface Pregunta {
  id: string;
  enunciado: string;
  respuestas: Respuesta[];
}