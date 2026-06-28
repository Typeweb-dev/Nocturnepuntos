'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import type React from 'react'

type Rule = {
  name: string
  pointsRequired: number
  rewardText: string
  active: boolean
} | null

export function RewardRuleForm({ rule }: { rule: Rule }) {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    const form = new FormData(event.currentTarget)

    startTransition(async () => {
      const response = await fetch('/api/configuracion/reward-rule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          pointsRequired: form.get('pointsRequired'),
          rewardText: form.get('rewardText'),
          active: true,
        }),
      })
      const result = await response.json()

      if (!response.ok || !result.success) {
        setMessage(result.message ?? 'No pudimos guardar la regla.')
        return
      }

      setMessage('Regla guardada.')
      router.refresh()
    })
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <label className="block">
        <span className="text-sm font-medium text-zinc-300">Nombre</span>
        <input name="name" defaultValue={rule?.name ?? 'Productos Nocturne'} required className={inputClass} />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-300">Puntos requeridos</span>
        <input name="pointsRequired" type="number" min="1" defaultValue={rule?.pointsRequired ?? 180} required className={inputClass} />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-300">Texto visible</span>
        <input name="rewardText" defaultValue={rule?.rewardText ?? '180 puntos o mas = canje por productos seleccionados'} required className={inputClass} />
      </label>
      {message && <p className="text-sm text-zinc-300">{message}</p>}
      <button
        disabled={isPending}
        className="h-10 rounded-lg bg-nocturne-accent px-4 text-sm font-semibold text-nocturne-black transition-smooth hover:bg-nocturne-accent-light disabled:opacity-60 sm:w-fit"
      >
        Guardar regla
      </button>
    </form>
  )
}

const inputClass =
  'mt-2 h-10 w-full rounded-lg border border-nocturne-light/20 bg-nocturne-dark px-3 text-sm text-white outline-none transition-smooth hover:border-nocturne-light/40 focus:border-nocturne-accent/50 focus:ring-2 focus:ring-nocturne-accent/20'
