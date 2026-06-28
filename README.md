# Nocturne Points

Sistema de fidelizacion para Nocturne Nicaragua. El admin crea clientes y QR unicos; el cliente escanea el QR, recibe puntos en su perfil y puede solicitar canjes por productos.

## Stack

- Next.js App Router
- TypeScript
- Prisma ORM 7
- PostgreSQL / Supabase
- Tailwind CSS
- JWT en cookies httpOnly
- QR firmados, cifrados y de un solo uso

## Flujo principal

1. El admin entra a `/admin/login`.
2. Crea o selecciona un cliente en `/admin/clientes`.
3. Genera un QR en `/admin/qrs/generar`.
4. El cliente escanea el QR y abre `/qr/[token]`.
5. El sistema suma los puntos una sola vez y lo manda a `/puntos/[code]`.
6. El cliente ve su perfil, balance, historial y productos disponibles.
7. Si solicita un canje, el sistema descuenta puntos y abre WhatsApp con los datos del cliente y del canje.
8. El admin valida el canje en `/admin/canjes`.

## Variables de entorno

Copia `.env.example` a `.env.local` en desarrollo. En Vercel, crea estas variables en `Settings > Environment Variables`.

```env
NEXT_PUBLIC_APP_URL="https://tu-dominio.vercel.app"
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/postgres?sslmode=require"
# Si Vercel/Supabase ya te crea otra variable, el codigo tambien acepta:
# POSTGRES_PRISMA_URL, POSTGRES_URL, POSTGRES_URL_NON_POOLING,
# DATABASE_URL_UNPOOLED o SUPABASE_DATABASE_URL.
QR_SECRET="secreto-largo-para-firmar-y-cifrar-los-qr"
AUTH_SECRET="secreto-largo-para-sesiones"
DEFAULT_POINTS_PER_QR=75
DEFAULT_QR_EXPIRATION_DAYS=2
ADMIN_EMAIL="admin@tudominio.com"
ADMIN_PASSWORD="contrasena-segura"
SEED_SAMPLE_DATA=false
```

`QR_SECRET` no debe cambiarse despues de generar QR reales, porque se usa para validar y reimprimir tokens existentes.

## Desarrollo local

```bash
pnpm install
pnpm run prisma:migrate
pnpm run prisma:seed
pnpm run dev
```

Abre `http://localhost:3000`.

## Base de datos en produccion

1. Crea un proyecto PostgreSQL en Supabase.
2. Copia la connection string en `DATABASE_URL`. Si tu proveedor ya creo `POSTGRES_PRISMA_URL`, `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`, `DATABASE_URL_UNPOOLED` o `SUPABASE_DATABASE_URL`, tambien funciona.
3. Usa una URL compatible con migraciones Prisma. Para Supabase, prefiere la conexion directa o pooler en modo session.
4. Aplica migraciones:

```bash
pnpm run prisma:deploy
```

5. Crea o actualiza el admin inicial:

```bash
pnpm run prisma:seed
```

El seed es seguro para produccion: no borra clientes, puntos, QR ni canjes. Solo crea/actualiza el admin y crea una regla inicial si no existe. Los datos de prueba solo se crean con `SEED_SAMPLE_DATA=true`.

## Deploy en Vercel

Este repo incluye `vercel.json`. Vercel ejecuta:

```bash
pnpm install --frozen-lockfile
pnpm run vercel-build
```

`vercel-build` ejecuta `next build`. Las migraciones se aplican aparte con `pnpm run prisma:deploy` para que el deploy no falle si Vercel no tiene la base disponible durante el build.

Pasos:

1. Sube el repo a GitHub.
2. Importa el proyecto en Vercel.
3. Configura todas las variables de entorno.
4. Haz deploy.
5. Abre `/api/health` en el dominio final. Debe responder `success: true`.
6. Entra a `/admin/login` con `ADMIN_EMAIL` y `ADMIN_PASSWORD`.

## Verificacion antes de subir

```bash
pnpm install --frozen-lockfile
pnpm exec prisma generate
pnpm run prisma:deploy
pnpm run prisma:seed
pnpm run deploy:check
```

`deploy:check` valida variables, conexion a la base, tablas Prisma y build de Next.

## Rutas principales

- `/` login publico por codigo de cliente
- `/puntos/[code]` perfil del cliente
- `/qr/[token]` canje automatico de QR
- `/admin/login` login admin
- `/admin` dashboard
- `/admin/clientes`
- `/admin/qrs`
- `/admin/qrs/generar`
- `/admin/canjes`
- `/admin/configuracion`
- `/api/health` estado de app, secretos y base de datos

## Seguridad

- Los QR son de un solo uso.
- El token real no se guarda en texto plano.
- La base guarda `tokenHash` y `tokenCiphertext`.
- La suma de puntos corre dentro de una transaccion serializable.
- Cada movimiento crea un `PointTransaction`.
- El panel admin usa cookie httpOnly.
- Las APIs de admin estan protegidas por proxy y por validacion interna.
- Los canjes publicos requieren sesion de cliente.
- Hay rate limit en login publico y solicitudes de canje.

## Operacion diaria

Para vender y asignar puntos:

1. Crea el cliente o revisa que exista.
2. Genera un QR con los puntos correctos.
3. Descarga/imprime el PNG del QR.
4. El cliente lo escanea desde su telefono.
5. El cliente queda logueado automaticamente en su perfil.
6. Si el QR ya fue usado, no suma puntos de nuevo.

Para validar canjes:

1. El cliente solicita un producto desde su perfil.
2. Se abre WhatsApp con los datos del cliente y canje.
3. El admin revisa `/admin/canjes`.
4. Cambia el estado a `APPROVED`, `COMPLETED` o `CANCELLED`.
5. Si se cancela, el sistema devuelve los puntos.
