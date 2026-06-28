import { NextRequest } from 'next/server'
import { requireAdminSessionFromRequest } from '@/lib/auth'
import { jsonError, jsonOk, validationError } from '@/lib/http'
import { getDashboardMetrics } from '@/services/dashboard.service'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    await requireAdminSessionFromRequest(request)
    const dashboard = await getDashboardMetrics()
    return jsonOk({ success: true, dashboard })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return jsonError('UNAUTHORIZED', 'Inicia sesion para continuar.', 401)
    }

    return validationError(error)
  }
}
