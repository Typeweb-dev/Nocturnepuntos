import { NextRequest } from 'next/server'
import { getCustomerSessionFromRequest } from '@/lib/auth'
import { jsonError, jsonOk, readJson, validationError } from '@/lib/http'
import { rateLimit } from '@/lib/rate-limit'
import { buildRedemptionWhatsAppUrl } from '@/lib/whatsapp'
import { createCustomerRedemption } from '@/services/canjes.service'
import { publicRedemptionSchema } from '@/validations/schemas'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const session = await getCustomerSessionFromRequest(request)

  if (!session) {
    return jsonError('UNAUTHORIZED', 'Ingresa tu codigo para continuar.', 401)
  }

  const limit = rateLimit(request, `customer-redeem:${session.code}`, 10)

  if (!limit.ok) {
    return jsonError('RATE_LIMITED', `Intenta de nuevo en ${limit.retryAfter} segundos.`, 429)
  }

  try {
    const data = publicRedemptionSchema.parse(await readJson(request))
    const result = await createCustomerRedemption(session.code, data.rewardId)
    const whatsappUrl = buildRedemptionWhatsAppUrl({
      customer: result.customer,
      redemption: {
        id: result.redemption.id,
        rewardName: result.redemption.rewardName,
        pointsUsed: result.redemption.pointsUsed,
        status: result.redemption.status,
      },
    })

    return jsonOk({
      success: true,
      message: `Canje solicitado: ${result.redemption.rewardName}`,
      customer: result.customer,
      redemption: {
        id: result.redemption.id,
        rewardName: result.redemption.rewardName,
        pointsUsed: result.redemption.pointsUsed,
        status: result.redemption.status,
        createdAt: result.redemption.createdAt.toISOString(),
      },
      whatsappUrl,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'REWARD_NOT_FOUND') {
      return jsonError('REWARD_NOT_FOUND', 'Recompensa no encontrada.', 404)
    }

    if (error instanceof Error && error.message === 'CUSTOMER_NOT_FOUND') {
      return jsonError('CUSTOMER_NOT_FOUND', 'Cliente no encontrado.', 404)
    }

    if (error instanceof Error && error.message === 'CUSTOMER_BLOCKED') {
      return jsonError('CUSTOMER_BLOCKED', 'Esta cuenta no puede canjear puntos.', 403)
    }

    if (error instanceof Error && error.message === 'INSUFFICIENT_POINTS') {
      return jsonError('INSUFFICIENT_POINTS', 'No tienes puntos suficientes para esta recompensa.', 422)
    }

    return validationError(error)
  }
}
