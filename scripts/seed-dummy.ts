/**
 * Seed de datos dummy para desarrollo: usuarios, proyectos, equipos,
 * personas y notas. Idempotente (upserts), se puede correr varias veces.
 *
 *   npm run seed:dummy
 *
 * Credenciales que crea (password para todos: "ritualis123"):
 *   admin@demo.ritualis  → admin (ve todo)
 *   mora@demo.ritualis   → member
 *   tomas@demo.ritualis  → member
 */
import mongoose, { type Types } from "mongoose";
import { hashSync } from "bcryptjs";
import { User, Project, Team, Person, Note } from "../lib/models";

const URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/ritualis";
const PASSWORD = "ritualis123";

async function upsertUser(name: string, email: string, role: "admin" | "member") {
  const passwordHash = hashSync(PASSWORD, 10);
  const doc = await User.findOneAndUpdate(
    { email },
    { $set: { name, role }, $setOnInsert: { email, passwordHash } },
    { upsert: true, returnDocument: "after" },
  );
  return doc._id as Types.ObjectId;
}

async function upsertProject(name: string, description: string, owner: Types.ObjectId) {
  const doc = await Project.findOneAndUpdate(
    { name, owner },
    { $set: { description } },
    { upsert: true, returnDocument: "after" },
  );
  return doc._id as Types.ObjectId;
}

async function upsertTeam(
  name: string,
  description: string,
  projects: Types.ObjectId[],
  owner: Types.ObjectId,
) {
  const doc = await Team.findOneAndUpdate(
    { name, owner },
    { $set: { description, projects } },
    { upsert: true, returnDocument: "after" },
  );
  return doc._id as Types.ObjectId;
}

async function upsertPerson(
  name: string,
  role: string,
  email: string,
  teams: Types.ObjectId[],
  owner: Types.ObjectId,
) {
  const doc = await Person.findOneAndUpdate(
    { email, owner },
    { $set: { name, role, teams } },
    { upsert: true, returnDocument: "after" },
  );
  return doc._id as Types.ObjectId;
}

async function upsertNote(person: Types.ObjectId, author: Types.ObjectId, text: string) {
  await Note.updateOne({ person, text }, { $set: { author } }, { upsert: true });
}

async function main() {
  await mongoose.connect(URI);
  console.log("Conectado a", URI);

  /* Usuarios */
  const admin = await upsertUser("Admin Demo", "admin@demo.ritualis", "admin");
  const mora = await upsertUser("Mora Suárez", "mora@demo.ritualis", "member");
  await upsertUser("Tomás Ferreyra", "tomas@demo.ritualis", "member");

  /* Proyectos (los del admin + uno de Mora para probar el scope por owner) */
  const apollo = await upsertProject(
    "Apollo – Plataforma de pagos",
    "Checkout, conciliación y reportes de pagos.",
    admin,
  );
  const atlas = await upsertProject(
    "Atlas – App móvil",
    "App iOS/Android para clientes finales.",
    admin,
  );
  const nimbus = await upsertProject(
    "Nimbus – Sitio interno",
    "Intranet y herramientas internas del equipo.",
    mora,
  );

  /* Equipos */
  const backend = await upsertTeam(
    "Backend Core",
    "APIs, integraciones y base de datos.",
    [apollo],
    admin,
  );
  const mobile = await upsertTeam(
    "Mobile Squad",
    "Desarrollo de la app móvil.",
    [atlas, apollo],
    admin,
  );
  const webInterna = await upsertTeam(
    "Web Interna",
    "Mantenimiento de la intranet.",
    [nimbus],
    mora,
  );

  /* Personas */
  const people: [string, string, string, Types.ObjectId[], Types.ObjectId][] = [
    ["Lucía Paredes", "Scrum Master", "lucia.paredes@demo.ritualis", [backend, mobile], admin],
    ["Martín Olivera", "Backend Dev", "martin.olivera@demo.ritualis", [backend], admin],
    ["Camila Reyes", "Backend Dev", "camila.reyes@demo.ritualis", [backend], admin],
    ["Federico Bianchi", "QA", "federico.bianchi@demo.ritualis", [backend, mobile], admin],
    ["Julieta Mansilla", "Product Owner", "julieta.mansilla@demo.ritualis", [mobile], admin],
    ["Nicolás Duarte", "Mobile Dev", "nicolas.duarte@demo.ritualis", [mobile], admin],
    ["Sofía Aguirre", "UX Designer", "sofia.aguirre@demo.ritualis", [mobile], admin],
    ["Bruno Castelli", "Frontend Dev", "bruno.castelli@demo.ritualis", [webInterna], mora],
  ];
  const personIds: Types.ObjectId[] = [];
  for (const [name, role, email, teams, owner] of people) {
    personIds.push(await upsertPerson(name, role, email, teams, owner));
  }

  /* Notas (algunas, sobre las primeras personas) */
  await upsertNote(personIds[0], admin, "Excelente facilitando la retro del Q2; repetir formato.");
  await upsertNote(personIds[0], admin, "Pidió rotar de squad en el próximo trimestre.");
  await upsertNote(personIds[1], admin, "Mentorear a Camila en el módulo de conciliación.");
  await upsertNote(personIds[4], admin, "Definir con ella el roadmap de la app antes del planning.");
  await upsertNote(personIds[7], mora, "Onboarding completado; asignarle el rediseño de la home.");

  console.log(
    `Seed dummy listo · ${await User.countDocuments()} usuarios · ` +
      `${await Project.countDocuments()} proyectos · ${await Team.countDocuments()} equipos · ` +
      `${await Person.countDocuments()} personas · ${await Note.countDocuments()} notas.`,
  );
  console.log(`Login demo: admin@demo.ritualis / ${PASSWORD}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
