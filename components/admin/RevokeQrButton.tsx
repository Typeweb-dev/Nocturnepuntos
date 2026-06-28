'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Ban, Loader2 } from 'lucide-react'

export function RevokeQrButton({ qrId, disabled }: { qrId: string; disabled?: boolean }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function revoke() {
    startTransition(async () => {
      await fetch(`/api/qrs/${qrId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REVOKED' }),
      })
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={revoke}
      disabled={disabled || isPending}
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-900/50 px-3 text-sm font-medium text-red-300 transition-smooth hover:bg-red-950/30 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Ban className="h-3.5 w-3.5" />}
      Anular
    </button>
  )
}
