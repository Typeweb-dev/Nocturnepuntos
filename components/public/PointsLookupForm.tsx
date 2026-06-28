'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'

export function PointsLookupForm() {
  const router = useRouter()
  const [code, setCode] = useState('')

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanCode = code.trim().toUpperCase()

    if (cleanCode) {
      router.push(`/puntos/${encodeURIComponent(cleanCode)}`)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor="customer-code">
        Codigo de cliente
      </label>
      <input
        id="customer-code"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        placeholder="NCT-001"
        className="h-12 min-w-0 flex-1 rounded-lg border border-white/10 bg-black/40 px-4 font-mono text-sm uppercase text-white outline-none transition placeholder:text-zinc-600 focus:border-nocturne-accent focus:ring-2 focus:ring-nocturne-accent/20"
      />
      <button className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-nocturne-accent px-5 text-sm font-semibold text-white transition hover:bg-nocturne-accent-light">
        <Search className="h-4 w-4" />
        Consultar puntos
      </button>
    </form>
  )
}
