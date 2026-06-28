'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Loader2, Save } from 'lucide-react'
import type React from 'react'

type CustomerFormProps = {
  customer?: {
    id: string
    code: string
    name: string
    email: string | null
    phone: string | null
    pointsBalance: number
    status: string
  }
}

export function CustomerForm({ customer }: CustomerFormProps) {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()
  const editing = Boolean(customer)

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    const form = new FormData(event.currentTarget)
    const payload = {
      code: form.get('code'),
      name: form.get('name'),
      email: form.get('email'),
      phone: form.get('phone'),
      pointsBalance: form.get('pointsBalance'),
      status: form.get('status'),
    }

    startTransition(async () => {
      const response = await fetch(editing ? `/api/clientes/${customer?.id}` : '/api/clientes', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (!response.ok || !result.success) {
        setMessage(result.message ?? 'No pudimos guardar el cliente.')
        return
      }

      router.push(`/admin/clientes/${result.customer.id}`)
      router.refresh()
    })
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Codigo">
          <input name="code" defaultValue={customer?.code} required className={inputClass} placeholder="NCT-010" />
        </Field>
        <Field label="Nombre">
          <input name="name" defaultValue={customer?.name} required className={inputClass} />
        </Field>
        <Field label="Email">
          <input name="email" type="email" defaultValue={customer?.email ?? ''} className={inputClass} />
        </Field>
        <Field label="Telefono">
          <input name="phone" defaultValue={customer?.phone ?? ''} className={inputClass} />
        </Field>
        <Field label="Puntos iniciales">
          <input
            name="pointsBalance"
            type="number"
            min="0"
            defaultValue={customer?.pointsBalance ?? 0}
            className={inputClass}
          />
        </Field>
        <Field label="Estado">
          <select name="status" defaultValue={customer?.status ?? 'ACTIVE'} className={inputClass}>
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
            <option value="BLOCKED">Bloqueado</option>
          </select>
        </Field>
      </div>
      {message && <p className="rounded-lg border border-red-800 bg-red-950/30 px-3 py-2 text-sm text-red-200">{message}</p>}
      <button
        disabled={isPending}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-nocturne-accent px-4 text-sm font-semibold text-nocturne-black transition-smooth hover:bg-nocturne-accent-light disabled:opacity-60 md:w-fit"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Guardar cliente
      </button>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  )
}

const inputClass =
  'h-10 w-full rounded-lg border border-nocturne-light/20 bg-nocturne-dark px-3 text-sm text-white outline-none transition-smooth hover:border-nocturne-light/40 focus:border-nocturne-accent/50 focus:ring-2 focus:ring-nocturne-accent/20'
