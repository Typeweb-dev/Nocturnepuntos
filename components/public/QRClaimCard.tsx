'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { AlertTriangle, CheckCircle2, Loader2, QrCode } from 'lucide-react'
import { Card } from '@/components/ui/Card'

type Preview =
  | {
      state: 'valid'
      customerName: string
      customerCode: string
      points: number
      expiresAt: string
    }
  | {
      state: 'invalid' | 'used' | 'expired' | 'revoked' | 'blocked'
      message: string
      customerCode?: string
    }

type ClaimResult =
  | {
      success: true
      message: string
      customer: { code: string; name: string; pointsBalance: number }
    }
  | {
      success: false
      code: string
      message: string
    }

export function QRClaimCard({ token, preview }: { token: string; preview: Preview }) {
  const [result, setResult] = useState<ClaimResult | null>(null)
  const [isPending, startTransition] = useTransition()

  function claim() {
    startTransition(async () => {
      const response = await fetch('/api/qrs/canjear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const payload = (await response.json()) as ClaimResult
      setResult(payload)
    })
  }

  if (result?.success) {
    return (
      <Card className="space-y-6 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-400" />
        <div>
          <h1 className="text-2xl font-semibold text-white">Puntos agregados</h1>
          <p className="mt-2 text-zinc-400">{result.message}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/30 p-4">
          <p className="text-sm text-zinc-400">{result.customer.name}</p>
          <p className="mt-1 font-mono text-sm text-nocturne-accent">{result.customer.code}</p>
          <p className="mt-4 text-4xl font-semibold text-white">{result.customer.pointsBalance}</p>
        </div>
        <Link
          href={`/puntos/${result.customer.code}`}
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-nocturne-accent px-4 text-sm font-semibold text-white hover:bg-nocturne-accent-light"
        >
          Ver mis puntos
        </Link>
      </Card>
    )
  }

  if (result && !result.success) {
    return <ClaimError message={result.message} customerCode={preview.state === 'valid' ? preview.customerCode : preview.customerCode} />
  }

  if (preview.state !== 'valid') {
    return <ClaimError message={preview.message} customerCode={preview.customerCode} />
  }

  return (
    <Card className="space-y-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg border border-nocturne-accent/40 bg-nocturne-accent/10">
        <QrCode className="h-7 w-7 text-nocturne-accent" />
      </div>
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-nocturne-accent">Nocturne Points</p>
        <h1 className="mt-3 text-2xl font-semibold text-white">Confirmar canje</h1>
        <p className="mt-2 text-zinc-400">Este QR sumara puntos a la cuenta de {preview.customerName}.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 text-left">
        <div className="rounded-lg border border-white/10 bg-black/30 p-4">
          <p className="text-xs text-zinc-500">Cliente</p>
          <p className="mt-1 text-sm font-medium text-white">{preview.customerCode}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/30 p-4">
          <p className="text-xs text-zinc-500">Puntos</p>
          <p className="mt-1 text-sm font-medium text-white">+{preview.points}</p>
        </div>
      </div>
      <button
        onClick={claim}
        disabled={isPending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-nocturne-accent px-4 text-sm font-semibold text-white transition hover:bg-nocturne-accent-light disabled:opacity-60"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Canjear puntos
      </button>
      <p className="text-xs text-zinc-500">Vence: {new Date(preview.expiresAt).toLocaleString('es-NI')}</p>
    </Card>
  )
}

function ClaimError({ message, customerCode }: { message: string; customerCode?: string }) {
  return (
    <Card className="space-y-6 text-center">
      <AlertTriangle className="mx-auto h-12 w-12 text-amber-400" />
      <div>
        <h1 className="text-2xl font-semibold text-white">QR no disponible</h1>
        <p className="mt-2 text-zinc-400">{message}</p>
      </div>
      {customerCode ? (
        <Link
          href={`/puntos/${customerCode}`}
          className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-white/10 px-4 text-sm font-semibold text-white hover:bg-white/5"
        >
          Ver puntos del cliente
        </Link>
      ) : (
        <Link
          href="/"
          className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-white/10 px-4 text-sm font-semibold text-white hover:bg-white/5"
        >
          Volver al inicio
        </Link>
      )}
    </Card>
  )
}
