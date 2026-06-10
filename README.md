# Ritualis

Sistema para facilitar **todas las ceremonias de Scrum** (Daily, Planning,
Review, Retro, Refinement) con una biblioteca de dinámicas, un modo facilitador
con temporizador, sesiones en vivo compartidas y gestión de proyectos, equipos
y personas.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **MongoDB** + **Mongoose**
- **Auth.js v5** (credenciales, registro abierto)
- **shadcn/ui** + Tailwind CSS v4 — tema claro/oscuro
- **Zod** para validación

## Modelo de datos

```
User (login, con rol admin/usuario)
  ├── Proyectos
  ├── Equipos        (M:N con proyectos)
  └── Personas       (M:N con equipos)
         └── Notas    (por persona)

Dinámicas  → seed (34) + creadas por el usuario, etiquetadas por ceremonia
Ceremonias → cada una independiente, con su propio set de dinámicas
Sesiones   → salas en vivo compartibles por código (/s/CODE)
```

## Puesta en marcha

Requiere MongoDB corriendo en local en `mongodb://127.0.0.1:27017`.

```bash
npm install
npm run seed     # carga las 34 dinámicas base en Mongo
npm run dev      # http://localhost:3000
```

Copiá `.env.example` a `.env.local` y completá:

```
MONGODB_URI=mongodb://127.0.0.1:27017/ritualis
AUTH_SECRET=<generado con: openssl rand -base64 32>
AUTH_TRUST_HOST=true
```

### Usuario de prueba

```
test@ritualis.dev / secret123
```

O registrá una cuenta nueva en `/register`.

## Estructura del proyecto

- `app/(auth)/` — login y registro
- `app/app/` — área protegida (dashboard, ceremonias, dinámicas, pantallas CRUD)
- `app/app/usuarios/` — gestión de usuarios (solo admin)
- `app/s/[code]/` — sala de sesión en vivo, accesible por código
- `app/api/` — endpoints de auth, dinámicas y sesiones en vivo
- `lib/models.ts` — esquemas de Mongoose
- `lib/data.ts` — lecturas (server components)
- `lib/actions/` — server actions (CRUD)
- `lib/session.ts` — helpers de sesión (`requireUser`, `requireAdmin`)
- `proxy.ts` — middleware de auth que protege todo excepto los estáticos
- `scripts/seed.ts` — seed de dinámicas (`npm run seed`)
- `scripts/seed-dummy.ts` — datos de ejemplo para desarrollo (`npm run seed:dummy`)

## Despliegue

La app está desplegada en Vercel: **https://ritualis.vercel.app**.

Variables de entorno requeridas en producción (Vercel → Settings →
Environment Variables, o `vercel env add`):

- `MONGODB_URI` — string de conexión a un MongoDB de producción (por ejemplo
  MongoDB Atlas: `mongodb+srv://…`). Acordate de habilitar las IPs de Vercel o
  usar `0.0.0.0/0` con credenciales fuertes.
- `AUTH_SECRET` — generá uno nuevo con `openssl rand -base64 32` (no reutilices
  el local).
- `AUTH_TRUST_HOST=true`

Después del primer deploy, cargá las dinámicas base contra la base de
producción: `MONGODB_URI=<uri-prod> npm run seed`.

## Colaboración

Las contribuciones son bienvenidas. Mirá la
[guía de colaboración](./CONTRIBUTING.md) para el flujo de trabajo, las
convenciones de código y cómo reportar bugs o proponer mejoras.

## Licencia

Distribuido bajo la licencia MIT. Ver [LICENSE](./LICENSE) para más detalles.
