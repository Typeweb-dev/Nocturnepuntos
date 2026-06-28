import { NextRequest } from 'next/server'
import { createCustomerSessionCookie } from '@/lib/auth'
import { jsonOk, readJson, validationError } from '@/lib/http'
import { claimRewardQr, getQrClaimPreview, QrClaimError } from '@/services/qr.service'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await readJson(request)

  try {
    const result = await claimRewardQr(body)
    const response = jsonOk({
      ...result,
      profileUrl: `/puntos/${encodeURIComponent(result.customer.code)}`,
    })
    response.cookies.set(await createCustomerSessionCookie({
      sub: result.customer.id,
      code: result.customer.code,
      name: result.customer.name,
    }))

    return response
  } catch (error) {
    if (error instanceof QrClaimError) {
      const token = typeof body === 'object' && body && 'token' in body ? String(body.token) : ''
      const preview = token ? await getQrClaimPreview(token) : null
      const customer = preview && 'qr' in preview ? preview.qr?.customer : null
      const response = jsonOk(
        {
          success: false,
          code: error.code,
          message: error.message,
          profileUrl: customer ? `/puntos/${encodeURIComponent(customer.code)}` : undefined,
        },
        { status: error.status },
      )

      if (customer && customer.status === 'ACTIVE') {
        response.cookies.set(await createCustomerSessionCookie({
          sub: customer.id,
          code: customer.code,
          name: customer.name,
        }))
      }

      return response
    }

    return validationError(error)
  }
}
