import { RedemptionStatus, RewardQrStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { expireStaleQrs } from '@/services/qr.service'

export async function getDashboardMetrics() {
  await expireStaleQrs()

  const today = new Date()
  const chartStart = new Date(today)
  chartStart.setHours(0, 0, 0, 0)
  chartStart.setDate(chartStart.getDate() - 19)

  const [
    totalCustomers,
    deliveredPoints,
    qrGenerated,
    qrPending,
    qrClaimed,
    qrExpired,
    pendingRedemptions,
    topCustomers,
    latestQrs,
    latestClaimedQrs,
    latestRedemptions,
    latestTransactions,
    chartTransactions,
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.pointTransaction.aggregate({
      where: { points: { gt: 0 } },
      _sum: { points: true },
    }),
    prisma.rewardQr.count(),
    prisma.rewardQr.count({ where: { status: RewardQrStatus.PENDING } }),
    prisma.rewardQr.count({ where: { status: RewardQrStatus.CLAIMED } }),
    prisma.rewardQr.count({ where: { status: RewardQrStatus.EXPIRED } }),
    prisma.redemption.count({ where: { status: { in: [RedemptionStatus.PENDING, RedemptionStatus.APPROVED] } } }),
    prisma.customer.findMany({
      orderBy: [{ pointsBalance: 'desc' }, { name: 'asc' }],
      take: 5,
    }),
    prisma.rewardQr.findMany({
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.rewardQr.findMany({
      where: {
        status: RewardQrStatus.CLAIMED,
        claimedAt: { not: null },
      },
      include: { customer: true },
      orderBy: { claimedAt: 'desc' },
      take: 5,
    }),
    prisma.redemption.findMany({
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.pointTransaction.findMany({
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.pointTransaction.findMany({
      where: {
        points: { gt: 0 },
        createdAt: { gte: chartStart },
      },
      select: {
        points: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    }),
  ])

  const chartData = Array.from({ length: 20 }, (_, index) => {
    const date = new Date(chartStart)
    date.setDate(chartStart.getDate() + index)
    return {
      date,
      label: date.toLocaleDateString('es-NI', { day: 'numeric', month: 'short' }),
      points: 0,
    }
  })
  const chartIndex = new Map(chartData.map((item) => [item.date.toISOString().slice(0, 10), item]))

  chartTransactions.forEach((transaction) => {
    const key = transaction.createdAt.toISOString().slice(0, 10)
    const day = chartIndex.get(key)
    if (day) {
      day.points += transaction.points
    }
  })

  const totalPointsDelivered = deliveredPoints._sum.points ?? 0

  return {
    totalCustomers,
    totalPointsDelivered,
    averagePointsPerCustomer: totalCustomers > 0 ? Math.round(totalPointsDelivered / totalCustomers) : 0,
    qrGenerated,
    qrPending,
    qrClaimed,
    qrExpired,
    pendingRedemptions,
    topCustomers,
    latestQrs,
    latestClaimedQrs,
    latestRedemptions,
    latestTransactions,
    chartData: chartData.map((item) => ({ date: item.label, points: item.points })),
  }
}
