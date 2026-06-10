import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var _mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongoose ?? { conn: null, promise: null };
global._mongoose = cached;

export async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  // La validación es lazy: solo falla al intentar conectar (no al importar el
  // módulo), así el build no requiere MONGODB_URI presente.
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Falta la variable de entorno MONGODB_URI");
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
