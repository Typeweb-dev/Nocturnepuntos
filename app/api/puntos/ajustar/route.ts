import { NextRequest } from 'next/server'
import { requireAdminSessionFromRequest } from '@/lib/auth'
import { jsonError, jsonOk, readJson, validationError } from '@/lib/http'
import { adjustPoints } from '@/services/puntos.service'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminSessionFromRequest(request)
    const result = await adjustPoints(await readJson(request), session.email)
    return jsonOk({ success: true, ...result }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return jsonError('UNAUTHORIZED', 'Inicia sesion para continuar.', 401)
    }

    if (error instanceof Error && error.message === 'CUSTOMER_NOT_FOUND') {
      return jsonError('CUSTOMER_NOT_FOUND', 'Cliente no encontrado.', 404)
    }

    if (error instanceof Error && error.message === 'INSUFFICIENT_POINTS') {
      return jsonError('INSUFFICIENT_POINTS', 'El ajuste deja el balance en negativo.', 422)
    }

    return validationError(error)
  }
}
