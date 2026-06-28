'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import type React from 'react'

type CustomerOption = {
  id: string
  code: string
  name: string
  pointsBalance: number
}

export function RedemptionForm({
  customers,
  defaultRewardName,
  defaultPoints,
}: {
  customers: CustomerOption[]
  defaultRewardName: string
  defaultPoints: number
}) {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    const formElement = event.currentTarget
    const form = new FormData(formElement)

    startTransition(async () => {
      const response = await fetch('/api/canjes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: form.get('customerId'),
          rewardName: form.get('rewardName'),
          pointsUsed: form.get('pointsUsed'),
        }),
      })
      const result = await response.json()

      if (!response.ok || !result.success) {
        setMessage(result.message ?? 'No pudimos registrar el canje.')
        return
      }

      formElement.reset()
      router.refresh()
    })
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-lg border border-nocturne-light/20 bg-nocturne-darker p-6">
      <label className="block">
        <span className="text-sm font-medium text-zinc-300">Cliente con puntos suficientes</span>
        <select name="customerId" required className={inputClass}>
          <option value="">Seleccionar cliente</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.code} - {customer.name} ({customer.pointsBalance} pts)
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-zinc-300">Recompensa</span>
          <input name="rewardName" defaultValue={defaultRewardName} required className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-zinc-300">Puntos</span>
          <input name="pointsUsed" type="number" min="1" defaultValue={defaultPoints} required className={inputClass} />
        </label>
      </div>
      {message && <p className="text-sm text-red-300">{message}</p>}
      <button
        disabled={isPending}
        className="h-10 rounded-lg bg-nocturne-accent px-4 text-sm font-semibold text-nocturne-black transition-smooth hover:bg-nocturne-accent-light disabled:opacity-60 sm:w-fit"
      >
        Registrar canje
      </button>
    </form>
  )
}

export function RedemptionStatusButton({ id, status, label }: { id: string; status: string; label: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function updateStatus() {
    startTransition(async () => {
      await fetch(`/api/canjes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={updateStatus}
      className="h-8 rounded-lg border border-nocturne-light/20 px-3 text-xs font-medium text-white transition-smooth hover:border-nocturne-accent/50 hover:bg-nocturne-dark disabled:opacity-50"
    >
      {label}
    </button>
  )
}

const inputClass =
  'mt-2 h-10 w-full rounded-lg border border-nocturne-light/20 bg-nocturne-dark px-3 text-sm text-white outline-none transition-smooth hover:border-nocturne-light/40 focus:border-nocturne-accent/50 focus:ring-2 focus:ring-nocturne-accent/20'
