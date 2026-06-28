'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type QRAutoClaimProps = {
  token: string
}

export function QRAutoClaim({ token }: QRAutoClaimProps) {
  const router = useRouter()
  const [message, setMessage] = useState('Validando QR Nocturne...')
  const [profileUrl, setProfileUrl] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function claim() {
      const response = await fetch('/api/qrs/canjear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const payload = await response.json()

      if (!active) return

      if (payload.profileUrl) {
        const status = payload.success ? 'claimed' : payload.code === 'QR_ALREADY_CLAIMED' ? 'used' : 'notice'
        router.replace(`${payload.profileUrl}?qr=${status}`)
        return
      }

      setMessage(payload.message ?? 'No pudimos validar este QR.')
      setProfileUrl(null)
    }

    claim().catch(() => {
      if (active) {
        setMessage('No pudimos validar este QR. Intenta de nuevo.')
      }
    })

    return () => {
      active = false
    }
  }, [router, token])

  return (
    <div className="rounded-lg border border-white/15 bg-black/70 p-6 text-center shadow-2xl shadow-black">
      <div className="mx-auto h-10 w-10 animate-pulse rounded-full border border-white/30" />
      <h1 className="mt-5 text-2xl font-black text-white">Nocturne Points</h1>
      <p className="mt-3 text-sm text-white/70">{message}</p>
      {profileUrl && (
        <Link href={profileUrl} className="mt-5 inline-flex rounded-full bg-white px-5 py-2 text-sm font-black text-black">
          Ver perfil
        </Link>
      )}
    </div>
  )
}
