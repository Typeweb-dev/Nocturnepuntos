'use client'

import { useState } from 'react'
import { Pencil, Check } from 'lucide-react'
import type { CatalogReward } from '@/lib/mock-data'

interface RewardConfigCardProps {
  reward: CatalogReward
}

export function RewardConfigCard({ reward }: RewardConfigCardProps) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(reward.name)
  const [points, setPoints] = useState(reward.pointsRequired)
  const [description, setDescription] = useState(reward.description)
  const [active, setActive] = useState(reward.status === 'AVAILABLE')

  return (
    <div className="rounded-xl border border-nocturne-light/15 bg-nocturne-dark p-4">
      {!editing ? (
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-white">{name}</h4>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                  active
                    ? 'border-green-700 bg-green-950/40 text-green-400'
                    : 'border-gray-700 bg-gray-800 text-gray-400'
                }`}
              >
                {active ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <p className="mt-1 text-sm text-nocturne-light">{description}</p>
            <p className="mt-2 text-sm font-semibold text-nocturne-accent">{points} puntos</p>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg border border-nocturne-light/20 p-2 text-nocturne-light transition-smooth hover:border-nocturne-accent/50 hover:text-white"
            aria-label="Editar recompensa"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-nocturne-light">Nombre</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-nocturne-light/20 bg-nocturne-darker px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-nocturne-light">Puntos requeridos</label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-nocturne-light/20 bg-nocturne-darker px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-nocturne-light">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 w-full resize-none rounded-lg border border-nocturne-light/20 bg-nocturne-darker px-3 py-2 text-sm text-white"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 accent-nocturne-accent"
            />
            Recompensa activa
          </label>
          <button
            onClick={() => setEditing(false)}
            className="inline-flex items-center gap-2 rounded-lg bg-nocturne-accent px-4 py-2 text-sm font-semibold text-nocturne-black transition-smooth hover:bg-nocturne-accent-light"
          >
            <Check className="h-4 w-4" />
            Guardar
          </button>
        </div>
      )}
    </div>
  )
}
