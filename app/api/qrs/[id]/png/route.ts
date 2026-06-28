import { NextRequest, NextResponse } from 'next/server'
import { requireAdminSessionFromRequest } from '@/lib/auth'
import { getRequestOrigin } from '@/lib/env'
import { getRewardQrPng } from '@/services/qr.service'
import { jsonError, validationError } from '@/lib/http'

export const runtime = 'nodejs'

type Context = {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, context: Context) {
  try {
    await requireAdminSessionFromRequest(_request)
    const { id } = await context.params
    const png = await getRewardQrPng(id, getRequestOrigin(_request))

    if (!png) {
      return jsonError('QR_NOT_FOUND', 'QR no encontrado.', 404)
    }

    return new NextResponse(png, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="nocturne-${id}.png"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return jsonError('UNAUTHORIZED', 'Inicia sesion para continuar.', 401)
    }

    return validationError(error)
  }
}
