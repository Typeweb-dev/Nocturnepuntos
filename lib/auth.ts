import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import {
  ADMIN_SESSION_COOKIE,
  CUSTOMER_SESSION_COOKIE,
  createCustomerSessionToken,
  createSessionToken,
  verifyCustomerSessionToken,
  verifySessionToken,
  type AdminSession,
  type CustomerSession,
} from '@/lib/session'

export async function createAdminSessionCookie(session: AdminSession) {
  const token = await createSessionToken(session)

  return {
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  return token ? verifySessionToken(token) : null
}

export async function getAdminSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  return token ? verifySessionToken(token) : null
}

export async function requireAdminSessionFromRequest(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request)

  if (!session) {
    throw new Error('UNAUTHORIZED')
  }

  return session
}

export async function createCustomerSessionCookie(session: CustomerSession) {
  const token = await createCustomerSessionToken(session)

  return {
    name: CUSTOMER_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  }
}

export async function getCustomerSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value
  return token ? verifyCustomerSessionToken(token) : null
}

export async function getCustomerSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value
  return token ? verifyCustomerSessionToken(token) : null
}
