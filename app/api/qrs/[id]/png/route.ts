import { NextRequest, NextResponse } from 'next/server'
import { getRewardQrPng } from '@/services/qr.service'
import { jsonError } from '@/lib/http'

export const runtime = 'nodejs'

type Context = {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, context: Context) {
  const { id } = await context.params
  const png = await getRewardQrPng(id)

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
}
