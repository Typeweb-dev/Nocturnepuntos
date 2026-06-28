import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import { getQrSecret } from '@/lib/env'

export function generateSecureToken(bytes = 32) {
  return randomBytes(bytes).toString('base64url')
}

export function hashQrToken(token: string) {
  return createHmac('sha256', getQrSecret()).update(token).digest('hex')
}

export function encryptQrToken(token: string) {
  const key = createHash('sha256').update(getQrSecret()).digest()
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return [iv, authTag, ciphertext].map((part) => part.toString('base64url')).join('.')
}

export function decryptQrToken(value: string) {
  const [ivValue, authTagValue, ciphertextValue] = value.split('.')

  if (!ivValue || !authTagValue || !ciphertextValue) {
    throw new Error('INVALID_TOKEN_CIPHERTEXT')
  }

  const key = createHash('sha256').update(getQrSecret()).digest()
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(ivValue, 'base64url'))
  decipher.setAuthTag(Buffer.from(authTagValue, 'base64url'))

  return Buffer.concat([
    decipher.update(Buffer.from(ciphertextValue, 'base64url')),
    decipher.final(),
  ]).toString('utf8')
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}
