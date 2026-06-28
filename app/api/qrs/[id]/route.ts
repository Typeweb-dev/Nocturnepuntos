import { NextRequest } from 'next/server'
import { requireAdminSessionFromRequest } from '@/lib/auth'
import { jsonError, jsonOk, readJson, validationError } from '@/lib/http'
import { revokeRewardQr } from '@/services/qr.service'

export const runtime = 'nodejs'

type Context = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, context: Context) {
  const { id } = await context.params
  const body = await readJson(request)

  if (body?.status !== 'REVOKED') {
    return jsonError('UNSUPPORTED_ACTION', 'Solo se permite anular QR desde este endpoint.', 422)
  }

  try {
    const session = await requireAdminSessionFromRequest(request)
    const qr = await revokeRewardQr(id, session.email)
    return jsonOk({ success: true, qr })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return jsonError('UNAUTHORIZED', 'Inicia sesion para continuar.', 401)
    }

    return validationError(error)
  }
}
