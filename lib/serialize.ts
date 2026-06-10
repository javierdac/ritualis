/** Convierte documentos de Mongoose (lean) en objetos planos JSON-safe. */
export function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}
