import React from 'react'
import { Award } from 'lucide-react'

interface PointsCardProps {
  totalPoints: number
  usedPoints: number
  availablePoints: number
  level: string
}

export function PointsCard({ totalPoints, usedPoints, availablePoints, level }: PointsCardProps) {
  const levelColor = {
    platinum: 'from-yellow-600 to-amber-600',
    gold: 'from-amber-600 to-orange-600',
    silver: 'from-slate-600 to-gray-600',
    bronze: 'from-orange-700 to-yellow-700',
  }

  return (
    <div
      className={`bg-gradient-to-br ${levelColor[level as keyof typeof levelColor] || 'from-nocturne-accent to-pink-700'} rounded-lg p-6 text-white`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">Total Points</p>
          <p className="mt-3 text-4xl font-bold">{totalPoints.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-white/20 p-3 backdrop-blur">
          <Award className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-white/70">Used</p>
          <p className="mt-1 font-semibold">{usedPoints.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-white/70">Available</p>
          <p className="mt-1 font-semibold">{availablePoints.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-4 text-xs text-white/70">
        {level.charAt(0).toUpperCase() + level.slice(1)} Member
      </div>
    </div>
  )
}
