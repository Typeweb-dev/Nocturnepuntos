import { jwtVerify, SignJWT } from 'jose'
import { getAuthSecret } from '@/lib/env'

export const ADMIN_SESSION_COOKIE = 'nocturne_admin'
export const CUSTOMER_SESSION_COOKIE = 'nocturne_customer'

export type AdminSession = {
  sub: string
  email: string
  name: string
  role: string
}

export type CustomerSession = {
  sub: string
  code: string
  name: string
}

function sessionSecret() {
  return new TextEncoder().encode(getAuthSecret())
}

export async function createSessionToken(session: AdminSession) {
  return new SignJWT(session)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(sessionSecret())
}

export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, sessionSecret())

    if (!payload.sub || !payload.email || !payload.name || !payload.role) {
      return null
    }

    return {
      sub: String(payload.sub),
      email: String(payload.email),
      name: String(payload.name),
      role: String(payload.role),
    }
  } catch {
    return null
  }
}

export async function createCustomerSessionToken(session: CustomerSession) {
  return new SignJWT({ ...session, scope: 'customer' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(sessionSecret())
}

export async function verifyCustomerSessionToken(token: string): Promise<CustomerSession | null> {
  try {
    const { payload } = await jwtVerify(token, sessionSecret())

    if (payload.scope !== 'customer' || !payload.sub || !payload.code || !payload.name) {
      return null
    }

    return {
      sub: String(payload.sub),
      code: String(payload.code),
      name: String(payload.name),
    }
  } catch {
    return null
  }
}
