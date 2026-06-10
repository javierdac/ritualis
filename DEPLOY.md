# Deploy de Ritualis (Vercel + MongoDB)

La app **ya está deployada** en Vercel y es accesible desde cualquier computadora:

- **Producción:** https://ritualis.vercel.app
- Proyecto Vercel: `javiers-projects-a10281ee/ritualis`

Funciona el login, el registro y toda la navegación estática. Para que carguen
las páginas con datos (dinámicas, equipos, sesiones en vivo) falta **un solo
paso**: conectar una base MongoDB accesible desde internet.

## Variables de entorno ya configuradas (Production)

- `AUTH_SECRET` ✅
- `AUTH_TRUST_HOST` ✅
- `MONGODB_URI` ⏳ **(falta — la conectás vos)**

## Pasos para conectar la base (cuando quieras)

### Opción A — MongoDB Atlas (gratis, recomendado)

1. Entrá a https://cloud.mongodb.com y creá un cluster **M0 (free)**.
2. **Database Access** → creá un usuario con contraseña.
3. **Network Access** → agregá `0.0.0.0/0` (permitir desde cualquier IP).
   > Imprescindible: Vercel usa IPs dinámicas. Sin esto, la conexión falla.
4. **Connect → Drivers** → copiá la connection string. Queda algo así:
   ```
   mongodb+srv://USUARIO:CLAVE@cluster0.xxxx.mongodb.net/ritualis?retryWrites=true&w=majority
   ```
   (asegurate de que el nombre de la base en la URL sea `ritualis`).

### Opción B — Vercel Marketplace

Dashboard de Vercel → proyecto `ritualis` → pestaña **Storage** → **Marketplace**
→ **MongoDB Atlas** → seguí el asistente. Setea la variable sola; si el nombre
no es `MONGODB_URI`, renombrala o avisame.

## Cargar la variable y dejar la base lista

Desde esta carpeta:

```bash
# 1) Cargar la connection string en producción
vercel env add MONGODB_URI production
# (pegá la URI cuando la pida)

# 2) Cargar las 17 dinámicas base en esa Mongo (corre desde tu máquina)
MONGODB_URI="mongodb+srv://...." npm run seed

# 3) Redeploy para que tome la nueva variable
vercel deploy --prod
```

Después entrá a https://ritualis.vercel.app/register, creá tu cuenta y listo:
la app queda 100% funcional entre las dos computadoras remotas.

## Cómo se usa entre dos computadoras

1. Persona A (facilitador) entra, elige una dinámica de tablero y toca
   **"Iniciar sesión en vivo"** → obtiene una sala `https://ritualis.vercel.app/s/CODIGO`.
2. Comparte ese link (botón **Invitar**).
3. Persona B (otra compu) abre el link y entra **con cuenta o como invitado**.
4. Ambas ven el tablero sincronizado en vivo (polling cada ~1.3s).

## Notas

- El "tiempo real" es por polling HTTP, así que funciona perfecto en el modelo
  serverless de Vercel (no necesita conexiones persistentes).
- Para deploys de **preview** (ramas), agregá también las 3 variables al entorno
  `preview` (`vercel env add NOMBRE preview`).
- Re-deploy rápido tras cambios locales: `vercel deploy --prod`.
