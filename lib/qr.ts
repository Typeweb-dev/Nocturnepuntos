import QRCode from 'qrcode'
import { getAppUrl } from '@/lib/env'
import { encryptQrToken, generateSecureToken, hashQrToken } from '@/lib/security'

export function createRewardQrToken() {
  const token = generateSecureToken()

  return {
    token,
    tokenHash: hashQrToken(token),
    tokenCiphertext: encryptQrToken(token),
  }
}

export function buildClaimUrl(token: string, baseUrl = getAppUrl()) {
  return `${baseUrl.replace(/\/$/, '')}/qr/${encodeURIComponent(token)}`
}

export async function renderQrPngBuffer(url: string) {
  return QRCode.toBuffer(url, {
    type: 'png',
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 960,
    color: {
      dark: '#0A0A0A',
      light: '#FFFFFF',
    },
  })
}
