'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import type React from 'react'

export function PointsAdjustForm({ customerId }: { customerId: string }) {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    const formElement = event.currentTarget
    const form = new FormData(formElement)

    startTransition(async () => {
      const response = await fetch('/api/puntos/ajustar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          points: form.get('points'),
          type: form.get('type'),
          description: form.get('description'),
        }),
      })
      const result = await response.json()

      if (!response.ok || !result.success) {
        setMessage(result.message ?? 'No pudimos ajustar puntos.')
        return
      }

      formElement.reset()
      router.refresh()
    })
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="points" type="number" required placeholder="+50 o -25" className={inputClass} />
        <select name="type" defaultValue="ADJUST" className={inputClass}>
          <option value="ADJUST">Ajuste</option>
          <option value="CANCEL">Cancelacion</option>
          <option value="EXPIRE">Expiracion</option>
        </select>
      </div>
      <input name="description" required placeholder="Motivo del ajuste" className={inputClass} />
      {message && <p className="text-sm text-red-300">{message}</p>}
      <button
        disabled={isPending}
        className="h-10 w-full rounded-lg bg-nocturne-accent px-4 text-sm font-semibold text-nocturne-black transition-smooth hover:bg-nocturne-accent-light disabled:opacity-60"
      >
        Registrar ajuste
      </button>
    </form>
  )
}

const inputClass =
  'h-10 w-full rounded-lg border border-nocturne-light/20 bg-nocturne-dark px-3 text-sm text-white outline-none transition-smooth hover:border-nocturne-light/40 focus:border-nocturne-accent/50 focus:ring-2 focus:ring-nocturne-accent/20'
