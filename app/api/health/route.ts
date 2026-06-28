import { NextResponse } from 'next/server'
import { getAppUrl, getAuthSecret, getQrSecret } from '@/lib/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type HealthCheck = {
  ok: boolean
  appUrl: boolean
  qrSecret: boolean
  authSecret: boolean
  database: boolean
  schema: boolean
}

export async function GET() {
  const checks: HealthCheck = {
    ok: false,
    appUrl: false,
    qrSecret: false,
    authSecret: false,
    database: false,
    schema: false,
  }

  try {
    checks.appUrl = Boolean(new URL(getAppUrl()))
  } catch {
    checks.appUrl = false
  }

  try {
    checks.qrSecret = getQrSecret().length >= 16
  } catch {
    checks.qrSecret = false
  }

  try {
    checks.authSecret = getAuthSecret().length >= 16
  } catch {
    checks.authSecret = false
  }

  try {
    const { prisma } = await import('@/lib/prisma')
    await prisma.$queryRaw`SELECT 1`
    checks.database = true
    await prisma.rewardQr.count()
    checks.schema = true
  } catch {
    checks.database = false
    checks.schema = false
  }

  checks.ok = checks.appUrl && checks.qrSecret && checks.authSecret && checks.database && checks.schema

  return NextResponse.json(
    {
      success: checks.ok,
      service: 'nocturne-points',
      checks,
    },
    { status: checks.ok ? 200 : 503 },
  )
}
