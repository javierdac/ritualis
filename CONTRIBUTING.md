# Guía de colaboración

¡Gracias por querer contribuir a **Ritualis**! Esta guía resume cómo trabajar
sobre el proyecto para que los cambios entren de forma ordenada.

## Entorno de desarrollo

Requiere Node.js y MongoDB corriendo en local (`mongodb://127.0.0.1:27017`).

```bash
npm install
cp .env.example .env.local   # completá MONGODB_URI y AUTH_SECRET
npm run seed                 # carga las dinámicas base
npm run dev                  # http://localhost:3000
```

Para tener datos de ejemplo (proyectos, equipos, personas) durante el
desarrollo:

```bash
npm run seed:dummy
```

## Flujo de trabajo

1. Creá una rama desde `main`:
   ```bash
   git checkout -b feat/mi-cambio    # o fix/, chore/, docs/
   ```
2. Hacé tus cambios siguiendo las convenciones del proyecto (ver abajo).
3. Verificá que todo pasa antes de subir:
   ```bash
   npm run lint
   npm run build
   ```
4. Commiteá con un mensaje claro y descriptivo.
5. Abrí un Pull Request hacia `main` describiendo el cambio. Si toca la UI,
   sumá capturas de pantalla.

## Convenciones de código

- **TypeScript** en todo el proyecto.
- **Lecturas** desde server components → `lib/data.ts`.
- **Escrituras** (crear / editar / borrar) → server actions en `lib/actions/`.
- **Validación** de inputs con **Zod**.
- **UI** con componentes de **shadcn/ui** y Tailwind CSS v4; respetá el tema
  claro/oscuro existente.
- **Esquemas de datos** centralizados en `lib/models.ts`.
- Rutas protegidas con los helpers de `lib/session.ts`
  (`requireUser`, `requireAdmin`).
- Seguí el estilo y las convenciones de nombres del código que ya está.

## Estructura del proyecto

- `app/(auth)/` — login y registro
- `app/app/` — área protegida (dashboard, ceremonias, dinámicas, CRUD)
- `app/app/usuarios/` — gestión de usuarios (solo admin)
- `app/s/[code]/` — sala de sesión en vivo, accesible por código
- `app/api/` — endpoints de auth, dinámicas y sesiones en vivo
- `lib/` — modelos, datos, server actions y helpers de sesión
- `components/` — componentes de UI y de la app
- `scripts/` — seeds (`seed.ts`, `seed-dummy.ts`)

## Reportar bugs y proponer mejoras

Abrí un **issue** describiendo:

- Qué esperabas que pasara y qué pasó.
- Pasos para reproducirlo.
- Entorno (navegador, sistema operativo) si es relevante.

Para nuevas funcionalidades, contá el caso de uso antes de implementar para
acordar el enfoque.

## Licencia

Al contribuir, aceptás que tus aportes se distribuyan bajo la
[licencia MIT](./LICENSE) del proyecto.
