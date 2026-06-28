import { NextRequest } from 'next/server'
import { requireAdminSessionFromRequest } from '@/lib/auth'
import { jsonError, jsonOk, readJson, validationError } from '@/lib/http'
import { updateRedemption } from '@/services/canjes.service'

export const runtime = 'nodejs'

type Context = {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, context: Context) {
  const { id } = await context.params

  try {
    const session = await requireAdminSessionFromRequest(request)
    const redemption = await updateRedemption(id, await readJson(request), session.email)
    return jsonOk({ success: true, redemption })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return jsonError('UNAUTHORIZED', 'Inicia sesion para continuar.', 401)
    }

    if (error instanceof Error && error.message === 'REDEMPTION_NOT_FOUND') {
      return jsonError('REDEMPTION_NOT_FOUND', 'Canje no encontrado.', 404)
    }

    return validationError(error)
  }
}
