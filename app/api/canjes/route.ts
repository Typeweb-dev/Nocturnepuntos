import { NextRequest } from 'next/server'
import { getAdminSessionFromRequest } from '@/lib/auth'
import { jsonError, jsonOk, readJson, validationError } from '@/lib/http'
import { createRedemption, listRedemptions } from '@/services/canjes.service'

export const runtime = 'nodejs'

export async function GET() {
  const redemptions = await listRedemptions()
  return jsonOk({ success: true, redemptions })
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSessionFromRequest(request)
    const redemption = await createRedemption(await readJson(request), session?.email ?? 'admin')
    return jsonOk({ success: true, redemption }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'CUSTOMER_NOT_FOUND') {
      return jsonError('CUSTOMER_NOT_FOUND', 'Cliente no encontrado.', 404)
    }

    if (error instanceof Error && error.message === 'CUSTOMER_BLOCKED') {
      return jsonError('CUSTOMER_BLOCKED', 'El cliente no esta activo.', 403)
    }

    if (error instanceof Error && error.message === 'INSUFFICIENT_POINTS') {
      return jsonError('INSUFFICIENT_POINTS', 'El cliente no tiene puntos suficientes.', 422)
    }

    return validationError(error)
  }
}
