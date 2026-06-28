'use client'

import { Clock } from 'lucide-react'

interface PendingRedemptionCardProps {
  rewardName: string
}

export function PendingRedemptionCard({ rewardName }: PendingRedemptionCardProps) {
  return (
    <div className="rounded-2xl border border-yellow-700/40 bg-yellow-950/20 p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-yellow-500/15 p-2.5">
          <Clock className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Canje pendiente</h3>
            <span className="inline-flex items-center rounded-full border border-yellow-700 bg-yellow-950/40 px-2.5 py-0.5 text-xs font-medium text-yellow-400">
              Pendiente de aprobación
            </span>
          </div>
          <p className="mt-2 text-sm text-white">
            Recompensa: <span className="font-medium">{rewardName}</span>
          </p>
          <p className="mt-2 text-sm text-nocturne-light">
            Te contactaremos para coordinar la entrega o personalización.
          </p>
        </div>
      </div>
    </div>
  )
}
