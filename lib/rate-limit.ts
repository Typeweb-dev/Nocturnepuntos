import { NextRequest } from 'next/server'

const attempts = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(request: NextRequest, scope: string, limit = 20, windowMs = 60_000) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = request.headers.get('x-real-ip')?.trim()
  const key = `${scope}:${forwardedFor || realIp || 'unknown'}`
  const now = Date.now()
  const current = attempts.get(key)

  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfter: 0 }
  }

  if (current.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) }
  }

  current.count += 1
  return { ok: true, retryAfter: 0 }
}
