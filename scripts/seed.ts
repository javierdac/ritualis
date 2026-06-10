import mongoose from "mongoose";
import { DINAMICAS } from "../lib/dynamics";
import { Dynamic } from "../lib/models";

const URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/ritualis";

async function main() {
  await mongoose.connect(URI);
  console.log("Conectado a", URI);

  let creadas = 0;
  let actualizadas = 0;
  for (const d of DINAMICAS) {
    const res = await Dynamic.updateOne(
      { nombre: d.nombre, isSeed: true },
      { $set: { ...d, isSeed: true, owner: undefined } },
      { upsert: true },
    );
    if (res.upsertedCount) creadas++;
    else if (res.modifiedCount) actualizadas++;
  }

  const total = await Dynamic.countDocuments({ isSeed: true });
  console.log(
    `Seed listo · ${creadas} creadas, ${actualizadas} actualizadas · ${total} dinámicas seed en total.`,
  );
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
