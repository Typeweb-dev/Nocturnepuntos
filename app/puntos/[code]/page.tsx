import { redirect } from 'next/navigation'
import { RedemptionStatus, type PointTransaction } from '@prisma/client'
import { CustomerProfileClient } from '@/components/public/CustomerProfileClient'
import { getCustomerSession } from '@/lib/auth'
import { getClientCss } from '@/lib/client-css'
import { prisma } from '@/lib/prisma'
import { publicRewards } from '@/lib/rewards'
import { formatDateTime } from '@/lib/utils-nocturne'
import { buildRedemptionWhatsAppUrl } from '@/lib/whatsapp'
import { getCustomerByCode } from '@/services/clientes.service'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ code: string }>
  searchParams: Promise<{ qr?: string }>
}

export default async function PuntosPage({ params, searchParams }: PageProps) {
  const [{ code }, { qr }, session] = await Promise.all([params, searchParams, getCustomerSession()])
  const customerCode = decodeURIComponent(code).toUpperCase()

  if (!session || session.code !== customerCode) {
    redirect(`/?next=/puntos/${encodeURIComponent(customerCode)}`)
  }

  const customer = await getCustomerByCode(customerCode)

  if (!customer) {
    redirect('/?error=not-found')
  }

  const redemptionTotals = await prisma.redemption.aggregate({
    where: {
      customerId: customer.id,
      status: { not: RedemptionStatus.CANCELLED },
    },
    _sum: { pointsUsed: true },
    _count: true,
  })

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: getClientCss('profile') }} />
      <CustomerProfileClient
        customer={{
          name: customer.name,
          code: customer.code,
          pointsBalance: customer.pointsBalance,
          status: customer.status,
        }}
        rewards={publicRewards}
        usedPoints={redemptionTotals._sum.pointsUsed ?? 0}
        redeemCount={redemptionTotals._count}
        activities={customer.transactions.map(toProfileActivity)}
        redemptions={customer.redemptions.map((redemption) => {
          const redemptionPayload = {
            id: redemption.id,
            rewardName: redemption.rewardName,
            pointsUsed: redemption.pointsUsed,
            status: redemption.status,
          }

          return {
            ...redemptionPayload,
            createdAt: redemption.createdAt.toISOString(),
            completedAt: redemption.completedAt?.toISOString() ?? null,
            whatsappUrl:
              redemption.status === 'PENDING'
                ? buildRedemptionWhatsAppUrl({
                    customer: {
                      name: customer.name,
                      code: customer.code,
                      email: customer.email,
                      phone: customer.phone,
                      pointsBalance: customer.pointsBalance,
                    },
                    redemption: redemptionPayload,
                  })
                : undefined,
          }
        })}
        initialNotice={getQrNotice(qr)}
      />
    </>
  )
}

function getQrNotice(qr?: string) {
  if (qr === 'claimed') {
    return 'Puntos agregados a tu cuenta.'
  }

  if (qr === 'used') {
    return 'Este QR ya habia sido usado; no se sumaron puntos.'
  }

  if (qr === 'notice') {
    return 'Revisa el estado de tu QR en tu perfil.'
  }

  return undefined
}

function toProfileActivity(transaction: PointTransaction) {
  const isGain = transaction.points >= 0

  return {
    id: transaction.id,
    points: transaction.points,
    type: isGain ? ('gain' as const) : ('used' as const),
    title: getActivityTitle(transaction),
    description: `${transaction.description} - ${formatDateTime(transaction.createdAt.toISOString())}`,
  }
}

function getActivityTitle(transaction: PointTransaction) {
  if (transaction.type === 'EARN') {
    return 'QR escaneado'
  }

  if (transaction.type === 'REDEEM') {
    return 'Canje solicitado'
  }

  if (transaction.type === 'CANCEL') {
    return 'Canje cancelado'
  }

  if (transaction.type === 'EXPIRE') {
    return 'Puntos expirados'
  }

  return 'Ajuste de puntos'
}
