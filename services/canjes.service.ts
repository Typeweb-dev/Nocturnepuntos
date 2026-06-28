import { Prisma, RedemptionStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getPublicReward } from '@/lib/rewards'
import { redemptionCreateSchema, redemptionUpdateSchema } from '@/validations/schemas'

export async function listRedemptions() {
  return prisma.redemption.findMany({
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function listEligibleCustomers(pointsRequired = 100) {
  return prisma.customer.findMany({
    where: {
      status: 'ACTIVE',
      pointsBalance: { gte: pointsRequired },
    },
    orderBy: [{ pointsBalance: 'desc' }, { name: 'asc' }],
  })
}

export async function createRedemption(input: unknown, actor = 'admin') {
  const data = redemptionCreateSchema.parse(input)

  return prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({ where: { id: data.customerId } })

    if (!customer) {
      throw new Error('CUSTOMER_NOT_FOUND')
    }

    if (customer.status !== 'ACTIVE') {
      throw new Error('CUSTOMER_BLOCKED')
    }

    if (customer.pointsBalance < data.pointsUsed) {
      throw new Error('INSUFFICIENT_POINTS')
    }

    const nextBalance = customer.pointsBalance - data.pointsUsed

    const redemption = await tx.redemption.create({
      data: {
        customerId: customer.id,
        pointsUsed: data.pointsUsed,
        rewardName: data.rewardName,
        status: RedemptionStatus.PENDING,
      },
      include: { customer: true },
    })

    await tx.customer.update({
      where: { id: customer.id },
      data: { pointsBalance: nextBalance },
    })

    await tx.pointTransaction.create({
      data: {
        customerId: customer.id,
        type: 'REDEEM',
        points: -data.pointsUsed,
        balanceAfter: nextBalance,
        description: `Canje registrado: ${data.rewardName}.`,
      },
    })

    await tx.auditLog.create({
      data: {
        action: 'REDEMPTION_CREATED',
        entity: 'Redemption',
        entityId: redemption.id,
        description: `${actor} registro ${data.rewardName} para ${customer.code}.`,
      },
    })

    return redemption
  })
}

export async function createCustomerRedemption(customerCode: string, rewardId: number) {
  const reward = getPublicReward(rewardId)

  if (!reward) {
    throw new Error('REWARD_NOT_FOUND')
  }

  return prisma.$transaction(
    async (tx) => {
      const customer = await tx.customer.findUnique({
        where: { code: customerCode.toUpperCase() },
      })

      if (!customer) {
        throw new Error('CUSTOMER_NOT_FOUND')
      }

      if (customer.status !== 'ACTIVE') {
        throw new Error('CUSTOMER_BLOCKED')
      }

      const debited = await tx.customer.updateMany({
        where: {
          id: customer.id,
          status: 'ACTIVE',
          pointsBalance: { gte: reward.cost },
        },
        data: {
          pointsBalance: { decrement: reward.cost },
        },
      })

      if (debited.count !== 1) {
        throw new Error('INSUFFICIENT_POINTS')
      }

      const updatedCustomer = await tx.customer.findUniqueOrThrow({
        where: { id: customer.id },
      })

      const redemption = await tx.redemption.create({
        data: {
          customerId: customer.id,
          pointsUsed: reward.cost,
          rewardName: reward.name,
          status: RedemptionStatus.PENDING,
        },
        include: { customer: true },
      })

      await tx.pointTransaction.create({
        data: {
          customerId: customer.id,
          type: 'REDEEM',
          points: -reward.cost,
          balanceAfter: updatedCustomer.pointsBalance,
          description: `Canje solicitado: ${reward.name}.`,
        },
      })

      await tx.auditLog.create({
        data: {
          action: 'PUBLIC_REDEMPTION_CREATED',
          entity: 'Redemption',
          entityId: redemption.id,
          description: `${customer.code} solicito ${reward.name} desde su perfil.`,
        },
      })

      return {
        redemption,
        customer: {
          code: updatedCustomer.code,
          name: updatedCustomer.name,
          email: updatedCustomer.email,
          phone: updatedCustomer.phone,
          pointsBalance: updatedCustomer.pointsBalance,
        },
      }
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  )
}

export async function updateRedemption(id: string, input: unknown, actor = 'admin') {
  const data = redemptionUpdateSchema.parse(input)

  return prisma.$transaction(async (tx) => {
    const current = await tx.redemption.findUnique({
      where: { id },
      include: { customer: true },
    })

    if (!current) {
      throw new Error('REDEMPTION_NOT_FOUND')
    }

    if (current.status === data.status) {
      return current
    }

    let completedAt: Date | null | undefined

    if (data.status === RedemptionStatus.COMPLETED) {
      completedAt = new Date()
    }

    if (data.status === RedemptionStatus.CANCELLED && current.status !== RedemptionStatus.CANCELLED) {
      const updatedCustomer = await tx.customer.update({
        where: { id: current.customerId },
        data: { pointsBalance: { increment: current.pointsUsed } },
      })

      await tx.pointTransaction.create({
        data: {
          customerId: current.customerId,
          type: 'CANCEL',
          points: current.pointsUsed,
          balanceAfter: updatedCustomer.pointsBalance,
          description: `Canje cancelado: ${current.rewardName}.`,
        },
      })
    }

    const updated = await tx.redemption.update({
      where: { id },
      data: {
        status: data.status,
        completedAt,
      },
      include: { customer: true },
    })

    await tx.auditLog.create({
      data: {
        action: 'REDEMPTION_UPDATED',
        entity: 'Redemption',
        entityId: id,
        description: `${actor} cambio el canje a ${data.status}.`,
      },
    })

    return updated
  })
}
