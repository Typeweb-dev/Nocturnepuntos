'use client'

import { Gift } from 'lucide-react'
import { RewardCard } from './RewardCard'
import type { CatalogReward } from '@/lib/mock-data'

interface RewardCatalogProps {
  rewards: CatalogReward[]
  availablePoints: number
  onRedeem: (reward: CatalogReward) => void
}

export function RewardCatalog({ rewards, availablePoints, onRedeem }: RewardCatalogProps) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-lg bg-nocturne-accent/10 p-2">
          <Gift className="h-5 w-5 text-nocturne-accent" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Recompensas disponibles</h2>
          <p className="text-sm text-nocturne-light">
            Canjea tus puntos por piezas exclusivas Nocturne
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rewards.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            availablePoints={availablePoints}
            onRedeem={onRedeem}
          />
        ))}
      </div>
    </section>
  )
}
