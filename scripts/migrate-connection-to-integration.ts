import mongoose from "mongoose";
import { Integration } from "../lib/models";

/* Migración: credenciales POR USUARIO → config POR PROYECTO.
 *
 * Antes la conexión (provider, baseUrl, email, token, githubBaseUrl,
 * githubToken) vivía en la colección `connections` (1:1 con User) y sólo el
 * mapeo al board vivía en `integrations` (1:1 con Project). Ahora `Integration`
 * guarda todo. Este script copia los campos de cada Connection a las
 * Integration del MISMO owner (quien las configuró).
 *
 * - Es idempotente: sólo rellena campos ausentes/vacíos en la Integration, así
 *   que no pisa proyectos ya reconfigurados bajo el modelo nuevo.
 * - Dry-run por defecto. Para escribir de verdad: `--apply`.
 *
 * Uso:
 *   tsx scripts/migrate-connection-to-integration.ts          # dry-run
 *   tsx scripts/migrate-connection-to-integration.ts --apply  # escribe
 */

const URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/ritualis";
const APPLY = process.argv.includes("--apply");

/** Forma de los documentos viejos de la colección `connections`. */
interface ConnectionDoc {
  owner: mongoose.Types.ObjectId;
  provider?: string;
  baseUrl?: string;
  email?: string;
  token?: string;
  githubBaseUrl?: string;
  githubToken?: string;
}

async function main() {
  await mongoose.connect(URI);
  console.log("Conectado a", URI, APPLY ? "· MODO APPLY" : "· DRY-RUN");

  // La colección `connections` ya no tiene modelo: la leemos cruda.
  const connections = await mongoose.connection
    .collection<ConnectionDoc>("connections")
    .find()
    .toArray();
  console.log(`Conexiones encontradas: ${connections.length}`);

  let touched = 0;
  let skippedNoChange = 0;

  for (const conn of connections) {
    // Todas las integraciones que configuró este usuario.
    const integrations = await Integration.find({ owner: conn.owner }).lean();
    if (integrations.length === 0) continue;

    for (const integ of integrations) {
      const set: Record<string, unknown> = {};

      // provider: rellenar sólo si está ausente o quedó en "sample".
      if (
        conn.provider &&
        conn.provider !== "sample" &&
        (!integ.provider || integ.provider === "sample")
      ) {
        set.provider = conn.provider;
      }
      // Resto de campos: rellenar sólo los vacíos en la Integration.
      for (const f of ["baseUrl", "email", "token", "githubBaseUrl", "githubToken"] as const) {
        if (conn[f] && !integ[f]) set[f] = conn[f];
      }

      if (Object.keys(set).length === 0) {
        skippedNoChange++;
        continue;
      }

      const fields = Object.keys(set).join(", ");
      console.log(`  proyecto ${String(integ.project)} ← ${fields}`);
      if (APPLY) await Integration.updateOne({ _id: integ._id }, { $set: set });
      touched++;
    }
  }

  console.log(
    `\n${APPLY ? "Aplicado" : "Dry-run"}: ${touched} integraciones ${
      APPLY ? "actualizadas" : "a actualizar"
    }, ${skippedNoChange} sin cambios.`,
  );
  if (!APPLY && touched > 0) {
    console.log("Volvé a correr con --apply para escribir los cambios.");
  }

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
