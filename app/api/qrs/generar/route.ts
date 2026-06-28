import { NextRequest } from 'next/server'
import { requireAdminSessionFromRequest } from '@/lib/auth'
import { jsonError, jsonOk, readJson, validationError } from '@/lib/http'
import { generateRewardQr } from '@/services/qr.service'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminSessionFromRequest(request)
    const result = await generateRewardQr(await readJson(request), session.email)

    return jsonOk(
      {
        success: true,
        qrId: result.qr.id,
        claimUrl: result.claimUrl,
        expiresAt: result.expiresAt,
        points: result.points,
        customer: result.qr.customer,
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return jsonError('UNAUTHORIZED', 'Inicia sesion para continuar.', 401)
    }

    if (error instanceof Error && error.message === 'CUSTOMER_NOT_FOUND') {
      return jsonError('CUSTOMER_NOT_FOUND', 'Selecciona un cliente valido.', 404)
    }

    return validationError(error)
  }
}
