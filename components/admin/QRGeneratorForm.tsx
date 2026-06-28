'use client'

import { useState, useTransition } from 'react'
import type React from 'react'
import Image from 'next/image'
import { Copy, Download, Loader2, QrCode } from 'lucide-react'

type CustomerOption = {
  id: string
  code: string
  name: string
}

type GeneratedQr = {
  qrId: string
  claimUrl: string
  expiresAt: string
  points: number
}

export function QRGeneratorForm({
  customers,
  defaultPoints,
  defaultExpirationDays,
  initialCustomerId,
}: {
  customers: CustomerOption[]
  defaultPoints: number
  defaultExpirationDays: number
  initialCustomerId?: string
}) {
  const [customerId, setCustomerId] = useState(initialCustomerId ?? '')
  const [generated, setGenerated] = useState<GeneratedQr | null>(null)
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    const form = new FormData(event.currentTarget)

    startTransition(async () => {
      const response = await fetch('/api/qrs/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: form.get('customerId'),
          points: form.get('points'),
          expiresInDays: form.get('expiresInDays'),
        }),
      })
      const result = await response.json().catch(() => ({
        success: false,
        message: 'No pudimos generar el QR. Revisa las variables DATABASE_URL, QR_SECRET y AUTH_SECRET en Vercel.',
      }))

      if (!response.ok || !result.success) {
        setMessage(result.message ?? 'No pudimos generar el QR.')
        return
      }

      setGenerated(result)
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <form onSubmit={submit} className="space-y-4 rounded-lg border border-nocturne-light/20 bg-nocturne-darker p-6">
        <Field label="Cliente">
          <select name="customerId" value={customerId} onChange={(event) => setCustomerId(event.target.value)} required className={inputClass}>
            <option value="">Seleccionar cliente</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.code} - {customer.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Puntos">
            <input name="points" type="number" min="1" defaultValue={defaultPoints} required className={inputClass} />
          </Field>
          <Field label="Expira en dias">
            <input name="expiresInDays" type="number" min="1" defaultValue={defaultExpirationDays} required className={inputClass} />
          </Field>
        </div>
        {message && <p className="rounded-lg border border-red-800 bg-red-950/30 px-3 py-2 text-sm text-red-200">{message}</p>}
        <button
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-nocturne-accent px-4 text-sm font-semibold text-nocturne-black transition-smooth hover:bg-nocturne-accent-light disabled:opacity-60"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <QrCode className="h-4 w-4" />}
          Generar QR
        </button>
      </form>

      <div className="rounded-lg border border-nocturne-light/20 bg-nocturne-darker p-6">
        {generated ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-white p-3">
              <Image
                src={`/api/qrs/${generated.qrId}/png`}
                alt="QR Nocturne Points"
                width={320}
                height={320}
                unoptimized
                className="h-auto w-full rounded"
              />
            </div>
            <div>
              <p className="text-xs text-zinc-500">URL del QR</p>
              <p className="mt-1 break-all font-mono text-xs text-zinc-300">{generated.claimUrl}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-nocturne-light/10 bg-nocturne-dark p-3">
                <p className="text-nocturne-light">Puntos</p>
                <p className="mt-1 font-semibold text-white">{generated.points}</p>
              </div>
              <div className="rounded-lg border border-nocturne-light/10 bg-nocturne-dark p-3">
                <p className="text-nocturne-light">Vence</p>
                <p className="mt-1 font-semibold text-white">{new Date(generated.expiresAt).toLocaleDateString('es-NI')}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(generated.claimUrl)}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-nocturne-light/20 text-sm font-semibold text-white transition-smooth hover:border-nocturne-accent/50 hover:bg-nocturne-dark"
            >
              <Copy className="h-4 w-4" />
              Copiar URL
            </button>
            <a
              href={`/api/qrs/${generated.qrId}/png`}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-nocturne-accent text-sm font-semibold text-nocturne-black transition-smooth hover:bg-nocturne-accent-light"
            >
              <Download className="h-4 w-4" />
              Descargar PNG
            </a>
          </div>
        ) : (
          <div className="flex min-h-80 flex-col items-center justify-center text-center">
            <QrCode className="h-12 w-12 text-nocturne-light" />
            <p className="mt-3 text-sm text-nocturne-light">Genera un QR para ver la vista previa.</p>
          </div>
        )}
      </div>
    </div>
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
