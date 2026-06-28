import { PointTransactionType } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { pointsAdjustSchema } from '@/validations/schemas'

export async function adjustPoints(input: unknown, actor = 'admin') {
  const data = pointsAdjustSchema.parse(input)

  return prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({ where: { id: data.customerId } })

    if (!customer) {
      throw new Error('CUSTOMER_NOT_FOUND')
    }

    const nextBalance = customer.pointsBalance + data.points

    if (nextBalance < 0) {
      throw new Error('INSUFFICIENT_POINTS')
    }

    const updatedCustomer = await tx.customer.update({
      where: { id: customer.id },
      data: { pointsBalance: nextBalance },
    })

    const transaction = await tx.pointTransaction.create({
      data: {
        customerId: customer.id,
        type: data.type as PointTransactionType,
        points: data.points,
        balanceAfter: nextBalance,
        description: data.description ?? getDefaultDescription(data.type, data.points),
      },
    })

    await tx.auditLog.create({
      data: {
        action: 'POINTS_ADJUSTED',
        entity: 'Customer',
        entityId: customer.id,
        description: `${actor} ajusto ${data.points} puntos a ${customer.code}.`,
      },
    })

    return { customer: updatedCustomer, transaction }
  })
}

function getDefaultDescription(type: PointTransactionType | string, points: number) {
  if (type === 'CANCEL') {
    return `Devolucion manual de ${Math.abs(points)} puntos.`
  }

  if (type === 'EXPIRE') {
    return `Expiracion manual de ${Math.abs(points)} puntos.`
  }

  return `Ajuste manual de ${points > 0 ? '+' : ''}${points} puntos.`
}
