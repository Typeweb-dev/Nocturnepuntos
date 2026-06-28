'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle2, Gift, ArrowRight } from 'lucide-react'
import type { CatalogReward } from '@/lib/mock-data'

interface RedeemRewardModalProps {
  reward: CatalogReward | null
  availablePoints: number
  open: boolean
  onClose: () => void
  onConfirm: (reward: CatalogReward) => void
}

export function RedeemRewardModal({
  reward,
  availablePoints,
  open,
  onClose,
  onConfirm,
}: RedeemRewardModalProps) {
  const [confirmed, setConfirmed] = useState(false)

  // Reset success state whenever the modal opens/closes or reward changes
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setConfirmed(false), 200)
      return () => clearTimeout(t)
    }
  }, [open])

  if (!open || !reward) return null

  const balanceAfter = availablePoints - reward.pointsRequired

  const handleConfirm = () => {
    onConfirm(reward)
    setConfirmed(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-nocturne-light/20 bg-nocturne-darker glow-accent">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-nocturne-light transition-smooth hover:bg-white/5 hover:text-white"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>

        {!confirmed ? (
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-nocturne-accent/10 p-2.5">
                <Gift className="h-5 w-5 text-nocturne-accent" />
              </div>
              <h3 className="text-lg font-bold text-white">Confirmar canje</h3>
            </div>

            <p className="mt-4 text-sm text-nocturne-light">
              Estás por canjear tus puntos por:
            </p>
            <p className="mt-1 text-xl font-semibold text-white">{reward.name}</p>

            {/* Breakdown */}
            <div className="mt-6 space-y-3 rounded-xl border border-nocturne-light/15 bg-nocturne-dark p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-nocturne-light">Puntos a descontar</span>
                <span className="font-semibold text-red-400">-{reward.pointsRequired}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-nocturne-light">Puntos actuales</span>
                <span className="font-semibold text-white">{availablePoints}</span>
              </div>
              <div className="flex items-center justify-between border-t border-nocturne-light/10 pt-3 text-sm">
                <span className="text-nocturne-light">Balance después del canje</span>
                <span className="font-bold text-nocturne-accent">{balanceAfter}</span>
              </div>
            </div>

            <p className="mt-4 text-xs text-nocturne-light">
              Este canje será revisado por el equipo Nocturne.
            </p>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-nocturne-light/20 bg-nocturne-dark px-4 py-2.5 text-sm font-medium text-white transition-smooth hover:bg-nocturne-darker"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-lg bg-nocturne-accent px-4 py-2.5 text-sm font-semibold text-nocturne-black transition-smooth hover:bg-nocturne-accent-light active:scale-[0.98]"
              >
                Confirmar canje
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-950/50">
              <CheckCircle2 className="h-9 w-9 text-green-400" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-white">Canje solicitado</h3>
            <p className="mt-2 text-sm text-nocturne-light">
              Tu recompensa será revisada por el equipo Nocturne.
            </p>

            <div className="mt-6 rounded-xl border border-nocturne-light/15 bg-nocturne-dark p-4">
              <p className="text-xs text-nocturne-light">Nuevo balance</p>
              <p className="mt-1 text-2xl font-bold text-nocturne-accent">
                {balanceAfter} <span className="text-sm font-medium text-nocturne-light">pts</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-nocturne-accent px-4 py-2.5 text-sm font-semibold text-nocturne-black transition-smooth hover:bg-nocturne-accent-light"
            >
              Volver a mis puntos
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
