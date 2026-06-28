import { NextRequest, NextResponse } from 'next/server'
import { createCustomerSessionCookie } from '@/lib/auth'
import { jsonError, readJson, validationError } from '@/lib/http'
import { rateLimit } from '@/lib/rate-limit'
import { prisma } from '@/lib/prisma'
import { customerLoginSchema } from '@/validations/schemas'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const limit = rateLimit(request, 'customer-login', 12)

  if (!limit.ok) {
    return jsonError('RATE_LIMITED', `Intenta de nuevo en ${limit.retryAfter} segundos.`, 429)
  }

  try {
    const data = customerLoginSchema.parse(await readJson(request))
    const code = data.code.toUpperCase()
    const customer = await prisma.customer.findUnique({
      where: { code },
      select: { id: true, code: true, name: true, status: true },
    })

    if (!customer || customer.status !== 'ACTIVE') {
      return jsonError('CUSTOMER_NOT_FOUND', 'Codigo no encontrado. Revisa el ID de tu paquete.', 404)
    }

    const response = NextResponse.json({
      success: true,
      customer: { code: customer.code, name: customer.name },
      profileUrl: `/puntos/${encodeURIComponent(customer.code)}`,
    })
    response.cookies.set(await createCustomerSessionCookie({
      sub: customer.id,
      code: customer.code,
      name: customer.name,
    }))

    return response
  } catch (error) {
    return validationError(error)
  }
}
