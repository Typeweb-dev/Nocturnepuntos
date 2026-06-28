const generateFallbackDatabaseUrl = 'postgresql://prisma:prisma@localhost:5432/nocturne_points'

type DatabaseUrlOptions = {
  allowGenerateFallback?: boolean
}

export function getDatabaseUrl(options: DatabaseUrlOptions = {}) {
  const databaseUrl =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.DATABASE_URL_UNPOOLED ??
    process.env.SUPABASE_DATABASE_URL

  if (databaseUrl) {
    return databaseUrl
  }

  if (options.allowGenerateFallback || isNextBuildPhase()) {
    return generateFallbackDatabaseUrl
  }

  throw new Error('DATABASE_URL is required to connect Nocturne Points to the database.')
}

export function getAppUrl() {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    formatVercelUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    formatVercelUrl(process.env.VERCEL_URL)

  if (!appUrl) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('NEXT_PUBLIC_APP_URL must be set in production.')
    }

    return 'http://localhost:3000'
  }

  return appUrl.replace(/\/$/, '')
}

export function getRequestOrigin(request: Request) {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https'

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`.replace(/\/$/, '')
  }

  return new URL(request.url).origin.replace(/\/$/, '')
}

export function getQrSecret() {
  const secret = process.env.QR_SECRET

  if (!secret || secret.length < 16) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('QR_SECRET must be set and at least 16 characters long.')
    }

    return 'nocturne-local-development-secret'
  }

  return secret
}

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET

  if (!secret || secret.length < 16) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('AUTH_SECRET must be set and at least 16 characters long.')
    }

    return getQrSecret()
  }

  if (process.env.NODE_ENV === 'production' && secret === process.env.QR_SECRET) {
    throw new Error('AUTH_SECRET and QR_SECRET must be different values.')
  }

  return secret
}

export function getDefaultPointsPerQr() {
  return readPositiveInt(process.env.DEFAULT_POINTS_PER_QR, 75)
}

export function getDefaultQrExpirationDays() {
  return readPositiveInt(process.env.DEFAULT_QR_EXPIRATION_DAYS, 2)
}

export function getDatabasePoolMax() {
  return readPositiveInt(process.env.DATABASE_POOL_MAX, 1)
}

function readPositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

function formatVercelUrl(value?: string) {
  if (!value) {
    return undefined
  }

  return value.startsWith('http') ? value : `https://${value}`
}

function isNextBuildPhase() {
  return (
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.npm_lifecycle_event === 'build' ||
    process.env.npm_lifecycle_event === 'vercel-build'
  )
}
