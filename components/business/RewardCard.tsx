'use client'

import Image from 'next/image'
import { Shirt, ShoppingBag, Package, Check, Lock } from 'lucide-react'
import type { CatalogReward } from '@/lib/mock-data'

interface RewardCardProps {
  reward: CatalogReward
  availablePoints: number
  onRedeem: (reward: CatalogReward) => void
}

const accentStyles = {
  blue: {
    glow: 'hover:shadow-[0_0_30px_rgba(0,217,255,0.25)]',
    border: 'hover:border-cyan-400/50',
    icon: 'text-cyan-400 bg-cyan-400/10',
    bar: 'bg-cyan-400',
    badge: 'text-cyan-300 border-cyan-400/30 bg-cyan-400/10',
  },
  neutral: {
    glow: 'hover:shadow-[0_0_30px_rgba(255,255,255,0.12)]',
    border: 'hover:border-white/40',
    icon: 'text-slate-200 bg-white/10',
    bar: 'bg-slate-200',
    badge: 'text-slate-200 border-white/20 bg-white/10',
  },
  purple: {
    glow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]',
    border: 'hover:border-violet-400/50',
    icon: 'text-violet-300 bg-violet-500/15',
    bar: 'bg-violet-400',
    badge: 'text-violet-200 border-violet-400/30 bg-violet-500/15',
  },
}

const iconMap = {
  shirt: Shirt,
  bag: ShoppingBag,
  hoodie: Package,
}

export function RewardCard({ reward, availablePoints, onRedeem }: RewardCardProps) {
  const accent = accentStyles[reward.accent]
  const Icon = iconMap[reward.icon]

  const canRedeem = availablePoints >= reward.pointsRequired
  const missingPoints = Math.max(reward.pointsRequired - availablePoints, 0)
  const percentage = Math.min(
    Math.round((availablePoints / reward.pointsRequired) * 100),
    100,
  )

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border border-nocturne-light/15 bg-nocturne-darker transition-smooth ${accent.border} ${accent.glow}`}
    >
      {/* Product visual */}
      <div className="relative h-44 w-full overflow-hidden bg-nocturne-dark">
        <Image
          src={reward.image || '/placeholder.svg'}
          alt={reward.name}
          fill
          className="object-cover transition-smooth group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-nocturne-darker via-transparent to-transparent" />
        {/* Category badge */}
        <span
          className={`absolute left-3 top-3 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${accent.badge}`}
        >
          {reward.category}
        </span>
        {/* Icon chip */}
        <div className={`absolute right-3 top-3 rounded-lg p-2 backdrop-blur ${accent.icon}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-white">{reward.name}</h3>
        <p className="mt-1 text-sm text-nocturne-light">{reward.tagline}</p>

        {/* Availability badge */}
        <div className="mt-4">
          {canRedeem ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-700 bg-green-950/40 px-3 py-1 text-xs font-medium text-green-400">
              <Check className="h-3.5 w-3.5" />
              Disponible para canjear
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-700 bg-yellow-950/40 px-3 py-1 text-xs font-medium text-yellow-400">
              <Lock className="h-3.5 w-3.5" />
              Te faltan {missingPoints} puntos
            </span>
          )}
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-nocturne-light">
              {Math.min(availablePoints, reward.pointsRequired)} / {reward.pointsRequired} pts
            </span>
            <span className="font-medium text-white">{percentage}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-nocturne-dark">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${accent.bar}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Action */}
        <button
          onClick={() => onRedeem(reward)}
          disabled={!canRedeem}
          className={`mt-5 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-smooth active:scale-[0.98] ${
            canRedeem
              ? 'bg-nocturne-accent text-nocturne-black hover:bg-nocturne-accent-light'
              : 'cursor-not-allowed border border-nocturne-light/15 bg-nocturne-dark text-nocturne-light'
          }`}
        >
          {canRedeem ? 'Canjear ahora' : 'Seguir acumulando'}
        </button>
      </div>
    </div>
  )
}
