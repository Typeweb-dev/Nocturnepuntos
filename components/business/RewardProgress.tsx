import React from 'react'
import { getMembershipColor } from '@/lib/utils-nocturne'

interface RewardProgressProps {
  current: number
  total: number
  level: string
  className?: string
}

export function RewardProgress({ current, total, level, className = '' }: RewardProgressProps) {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0

  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-medium text-white">Points Progress</h4>
        <span className={`text-sm font-semibold ${getMembershipColor(level)}`}>
          {current} / {total}
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-nocturne-dark">
        <div
          className={`h-full transition-all duration-500 ease-out ${
            level === 'platinum'
              ? 'bg-yellow-500'
              : level === 'gold'
                ? 'bg-amber-500'
                : level === 'silver'
                  ? 'bg-slate-400'
                  : 'bg-orange-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-nocturne-light">
        {Math.round(percentage)}% to next level
      </p>
    </div>
  )
}
