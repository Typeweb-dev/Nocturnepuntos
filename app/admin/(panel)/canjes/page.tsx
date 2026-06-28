import { Gift } from 'lucide-react'
import { RedemptionForm, RedemptionStatusButton } from '@/components/admin/RedemptionForm'
import { BentoCard } from '@/components/ui/BentoCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { publicRewards } from '@/lib/rewards'
import { listEligibleCustomers, listRedemptions } from '@/services/canjes.service'

export const dynamic = 'force-dynamic'

export default async function CanjesPage() {
  const defaultReward = publicRewards[0]
  const pointsRequired = defaultReward?.cost ?? 180
  const [eligibleCustomers, redemptions] = await Promise.all([
    listEligibleCustomers(pointsRequired),
    listRedemptions(),
  ])
  const eligibleCustomerOptions = eligibleCustomers.map((customer) => ({
    id: customer.id,
    code: customer.code,
    name: customer.name,
    pointsBalance: customer.pointsBalance,
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Canjes & Rewards</h1>
        <p className="mt-2 text-nocturne-light">Registra recompensas, descuenta puntos y conserva el historial.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <div className="space-y-6">
          <RedemptionForm
            customers={eligibleCustomerOptions}
            defaultRewardName={defaultReward?.name ?? 'Tote Bag Nocturne'}
            defaultPoints={pointsRequired}
          />

          <BentoCard variant="default">
            <h3 className="text-lg font-semibold text-white">Clientes listos</h3>
            <p className="mt-1 text-sm text-nocturne-light">Cumplen la regla activa de {pointsRequired} puntos.</p>
            <div className="mt-5 space-y-3">
              {eligibleCustomers.slice(0, 8).map((customer) => (
                <div key={customer.id} className="flex items-center justify-between rounded-lg border border-nocturne-light/10 bg-nocturne-dark p-3">
                  <div>
                    <p className="font-medium text-white">{customer.name}</p>
                    <p className="font-mono text-xs text-nocturne-light">{customer.code}</p>
                  </div>
                  <p className="font-semibold text-nocturne-accent">{customer.pointsBalance}</p>
                </div>
              ))}
              {eligibleCustomers.length === 0 && <p className="text-sm text-nocturne-light">Ningun cliente cumple la regla activa.</p>}
            </div>
          </BentoCard>
        </div>

        <div className="space-y-4">
          {redemptions.map((redemption) => (
            <BentoCard key={redemption.id} variant="default">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-nocturne-accent/10 p-3">
                    <Gift className="h-6 w-6 text-nocturne-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{redemption.customer.name}</p>
                    <p className="text-sm text-nocturne-light">{redemption.rewardName}</p>
                    <p className="mt-2 text-xs text-nocturne-light">
                      {redemption.customer.code} / solicitado {redemption.createdAt.toLocaleDateString('es-NI')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                  <div className="text-right">
                    <p className="text-sm text-nocturne-light">Puntos</p>
                    <p className="font-bold text-nocturne-accent">{redemption.pointsUsed}</p>
                  </div>
                  <StatusBadge status={redemption.status} />
                </div>
              </div>

              {(redemption.status === 'PENDING' || redemption.status === 'APPROVED') && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-nocturne-light/10 pt-4">
                  {redemption.status === 'PENDING' && (
                    <RedemptionStatusButton id={redemption.id} status="APPROVED" label="Aprobar" />
                  )}
                  <RedemptionStatusButton id={redemption.id} status="COMPLETED" label="Completar" />
                  <RedemptionStatusButton id={redemption.id} status="CANCELLED" label="Cancelar" />
                </div>
              )}
            </BentoCard>
          ))}

          {redemptions.length === 0 && (
            <BentoCard variant="default">
              <p className="py-8 text-center text-sm text-nocturne-light">Aun no hay canjes.</p>
            </BentoCard>
          )}
        </div>
      </div>
    </div>
  )
}
