export function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '')
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
  return process.env.AUTH_SECRET ?? getQrSecret()
}

export function getDefaultPointsPerQr() {
  return readPositiveInt(process.env.DEFAULT_POINTS_PER_QR, 75)
}

export function getDefaultQrExpirationDays() {
  return readPositiveInt(process.env.DEFAULT_QR_EXPIRATION_DAYS, 2)
}

function readPositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}
