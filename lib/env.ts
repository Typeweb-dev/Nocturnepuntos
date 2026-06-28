export function getAppUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  if (!appUrl) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('NEXT_PUBLIC_APP_URL must be set in production.')
    }

    return 'http://localhost:3000'
  }

  return appUrl.replace(/\/$/, '')
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

function readPositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}
