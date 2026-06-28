import { Prisma, RewardQrStatus } from '@prisma/client'
import { getDefaultPointsPerQr, getDefaultQrExpirationDays } from '@/lib/env'
import { prisma } from '@/lib/prisma'
import { buildClaimUrl, createRewardQrToken, renderQrPngBuffer } from '@/lib/qr'
import { decryptQrToken, hashQrToken } from '@/lib/security'
import { qrClaimSchema, qrGenerateSchema } from '@/validations/schemas'

export type QrClaimCode =
  | 'QR_INVALID'
  | 'QR_ALREADY_CLAIMED'
  | 'QR_EXPIRED'
  | 'QR_REVOKED'
  | 'CUSTOMER_BLOCKED'
  | 'SERVER_ERROR'

export class QrClaimError extends Error {
  constructor(
    public code: QrClaimCode,
    message: string,
    public status = 400,
  ) {
    super(message)
  }
}

export function qrClaimMessage(code: QrClaimCode) {
  switch (code) {
    case 'QR_INVALID':
      return 'Este QR no pertenece a Nocturne Points.'
    case 'QR_ALREADY_CLAIMED':
      return 'Este QR ya fue canjeado.'
    case 'QR_EXPIRED':
      return 'Este QR ya expiro.'
    case 'QR_REVOKED':
      return 'Este QR fue anulado.'
    case 'CUSTOMER_BLOCKED':
      return 'Esta cuenta no puede recibir puntos.'
    default:
      return 'No pudimos canjear este QR.'
  }
}

export async function expireStaleQrs() {
  return prisma.rewardQr.updateMany({
    where: {
      status: RewardQrStatus.PENDING,
      expiresAt: { lt: new Date() },
    },
    data: { status: RewardQrStatus.EXPIRED },
  })
}

export async function listRewardQrs(params?: { status?: RewardQrStatus }) {
  await expireStaleQrs()

  return prisma.rewardQr.findMany({
    where: params?.status ? { status: params.status } : undefined,
    include: { customer: true, order: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function generateRewardQr(input: unknown, actor = 'admin', baseUrl?: string) {
  const withDefaults = {
    points: getDefaultPointsPerQr(),
    expiresInDays: getDefaultQrExpirationDays(),
    ...(typeof input === 'object' && input ? input : {}),
  }
  const data = qrGenerateSchema.parse(withDefaults)
  const tokenData = createRewardQrToken()
  const expiresAt = new Date(Date.now() + data.expiresInDays * 24 * 60 * 60 * 1000)

  return prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({ where: { id: data.customerId } })

    if (!customer) {
      throw new Error('CUSTOMER_NOT_FOUND')
    }

    const qr = await tx.rewardQr.create({
      data: {
        tokenHash: tokenData.tokenHash,
        tokenCiphertext: tokenData.tokenCiphertext,
        customerId: data.customerId,
        points: data.points,
        expiresAt,
      },
      include: { customer: true, order: true },
    })

    await tx.auditLog.create({
      data: {
        action: 'QR_GENERATED',
        entity: 'RewardQr',
        entityId: qr.id,
        description: `${actor} genero un QR de ${qr.points} puntos para ${customer.code}.`,
      },
    })

    return {
      qr,
      token: tokenData.token,
      claimUrl: buildClaimUrl(tokenData.token, baseUrl),
      expiresAt,
      points: qr.points,
    }
  })
}

export async function getQrClaimPreview(token: string) {
  const tokenHash = hashQrToken(token)
  const qr = await prisma.rewardQr.findUnique({
    where: { tokenHash },
    include: { customer: true, order: true },
  })

  if (!qr) {
    return { state: 'invalid' as const, code: 'QR_INVALID' as const, message: qrClaimMessage('QR_INVALID') }
  }

  if (qr.status === RewardQrStatus.CLAIMED) {
    return { state: 'used' as const, qr, code: 'QR_ALREADY_CLAIMED' as const, message: qrClaimMessage('QR_ALREADY_CLAIMED') }
  }

  if (qr.status === RewardQrStatus.REVOKED) {
    return { state: 'revoked' as const, qr, code: 'QR_REVOKED' as const, message: qrClaimMessage('QR_REVOKED') }
  }

  if (qr.status === RewardQrStatus.EXPIRED || qr.expiresAt < new Date()) {
    return { state: 'expired' as const, qr, code: 'QR_EXPIRED' as const, message: qrClaimMessage('QR_EXPIRED') }
  }

  if (qr.customer.status !== 'ACTIVE') {
    return { state: 'blocked' as const, qr, code: 'CUSTOMER_BLOCKED' as const, message: qrClaimMessage('CUSTOMER_BLOCKED') }
  }

  return { state: 'valid' as const, qr }
}

export async function claimRewardQr(input: unknown) {
  const data = qrClaimSchema.parse(input)
  const tokenHash = hashQrToken(data.token)
  const now = new Date()
  const scannedQr = await prisma.rewardQr.findUnique({
    where: { tokenHash },
    select: { id: true },
  })

  if (!scannedQr) {
    throw new QrClaimError('QR_INVALID', qrClaimMessage('QR_INVALID'), 404)
  }

  await prisma.rewardQr.update({
    where: { id: scannedQr.id },
    data: {
      scanCount: { increment: 1 },
      lastScannedAt: now,
    },
  })

  try {
    return await prisma.$transaction(
      async (tx) => {
        const qr = await tx.rewardQr.findUnique({
          where: { tokenHash },
          include: { customer: true },
        })

        if (!qr) {
          throw new QrClaimError('QR_INVALID', qrClaimMessage('QR_INVALID'), 404)
        }

        if (qr.status === RewardQrStatus.CLAIMED) {
          throw new QrClaimError('QR_ALREADY_CLAIMED', qrClaimMessage('QR_ALREADY_CLAIMED'), 409)
        }

        if (qr.status === RewardQrStatus.REVOKED) {
          throw new QrClaimError('QR_REVOKED', qrClaimMessage('QR_REVOKED'), 409)
        }

        if (qr.status === RewardQrStatus.EXPIRED || qr.expiresAt <= now) {
          if (qr.status === RewardQrStatus.PENDING) {
            await tx.rewardQr.update({
              where: { id: qr.id },
              data: { status: RewardQrStatus.EXPIRED },
            })
          }

          throw new QrClaimError('QR_EXPIRED', qrClaimMessage('QR_EXPIRED'), 410)
        }

        if (qr.customer.status !== 'ACTIVE') {
          throw new QrClaimError('CUSTOMER_BLOCKED', qrClaimMessage('CUSTOMER_BLOCKED'), 403)
        }

        const claimed = await tx.rewardQr.updateMany({
          where: {
            id: qr.id,
            status: RewardQrStatus.PENDING,
            claimedAt: null,
            expiresAt: { gt: now },
          },
          data: {
            status: RewardQrStatus.CLAIMED,
            claimedAt: now,
          },
        })

        if (claimed.count !== 1) {
          throw new QrClaimError('QR_ALREADY_CLAIMED', qrClaimMessage('QR_ALREADY_CLAIMED'), 409)
        }

        const customer = await tx.customer.update({
          where: { id: qr.customerId },
          data: { pointsBalance: { increment: qr.points } },
        })

        await tx.pointTransaction.create({
          data: {
            customerId: qr.customerId,
            orderId: qr.orderId,
            rewardQrId: qr.id,
            type: 'EARN',
            points: qr.points,
            balanceAfter: customer.pointsBalance,
            description: `QR canjeado por ${qr.points} puntos.`,
          },
        })

        await tx.auditLog.create({
          data: {
            action: 'QR_CLAIMED',
            entity: 'RewardQr',
            entityId: qr.id,
            description: `${customer.code} recibio ${qr.points} puntos por QR.`,
          },
        })

        return {
          success: true,
          message: `${qr.points} puntos agregados.`,
          customer: {
            id: customer.id,
            code: customer.code,
            name: customer.name,
            pointsBalance: customer.pointsBalance,
          },
        }
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    )
  } catch (error) {
    if (error instanceof QrClaimError) {
      throw error
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
      throw new QrClaimError('QR_ALREADY_CLAIMED', qrClaimMessage('QR_ALREADY_CLAIMED'), 409)
    }

    throw error
  }
}

export async function getRewardQrPng(id: string, baseUrl?: string) {
  const qr = await prisma.rewardQr.findUnique({ where: { id } })

  if (!qr?.tokenCiphertext) {
    return null
  }

  const token = decryptQrToken(qr.tokenCiphertext)
  return renderQrPngBuffer(buildClaimUrl(token, baseUrl))
}

export async function revokeRewardQr(id: string, actor = 'admin') {
  const qr = await prisma.rewardQr.update({
    where: { id },
    data: { status: RewardQrStatus.REVOKED },
  })

  await prisma.auditLog.create({
    data: {
      action: 'QR_REVOKED',
      entity: 'RewardQr',
      entityId: id,
      description: `${actor} anulo un QR de ${qr.points} puntos.`,
    },
  })

  return qr
}
