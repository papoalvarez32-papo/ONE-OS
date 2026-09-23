# One OS — v1

Control de pagos y relación con estudiantes de **Emprenderme Máster**.
Ver [`PROMPT — Construccion v1.md`](PROMPT%20—%20Construccion%20v1.md) y
[`REQUISITOS v1.md`](REQUISITOS%20v1.md) para el detalle funcional.

Stack: Next.js (App Router) + Supabase (Postgres + Auth) + Tailwind, desplegado en Vercel.

## 1. Crear el proyecto en Supabase

1. Entra a [supabase.com](https://supabase.com) y crea un proyecto nuevo (o usa uno existente).
2. En **SQL Editor**, pega y ejecuta el contenido de
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
   Esto crea las tablas (`estudiantes`, `cuotas`, `pagos_recibidos`, `gastos_fijos`,
   `mentores`), las políticas de seguridad (RLS) y siembra el único mentor ("David").
3. En **Authentication → Users**, crea manualmente el único usuario (David) con
   correo y contraseña. No hay registro público — el acceso es solo para ese usuario.
4. En **Project Settings → API**, copia la **Project URL** y la **anon public key**.

## 2. Configurar variables de entorno

Copia `.env.example` a `.env.local` y completa con los valores del paso anterior:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
```

## 3. Correr en local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) — te pedirá iniciar sesión con el
usuario creado en Supabase.

## 4. Desplegar en Vercel

1. Sube este repositorio a GitHub.
2. En [vercel.com/new](https://vercel.com/new), importa el repositorio.
3. Agrega las mismas variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`) en la configuración del proyecto en Vercel.
4. Deploy.

## Estructura

- `supabase/migrations/0001_init.sql` — modelo de datos completo.
- `lib/types.ts` — tipos compartidos.
- `lib/calculos.ts` — lógica pura de las 5 funciones (cobros de la semana,
  renovaciones próximas, resumen del mes, seguimientos). Sin dependencias de UI
  ni de Supabase, fácil de testear.
- `lib/datos.ts` — lectura de datos desde Supabase.
- `app/actions.ts` — Server Actions: marcar pago, marcar contactado, alta de
  estudiante, gastos fijos, login/logout.
- `app/page.tsx` — pantalla principal (resumen del mes, cobros de la semana,
  renovaciones próximas, seguimientos).
- `app/gastos/page.tsx` — gastos fijos.
- `app/login/page.tsx` — login.
