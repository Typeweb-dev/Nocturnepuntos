'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Loader2, LogIn } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/admin'
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const form = new FormData(event.currentTarget)

    startTransition(async () => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.get('email'),
          password: form.get('password'),
        }),
      })
      const payload = await response.json()

      if (!response.ok || !payload.success) {
        setError(payload.message ?? 'No pudimos iniciar sesion.')
        return
      }

      router.push(next)
      router.refresh()
    })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-zinc-300" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-2 h-11 w-full rounded-lg border border-nocturne-light/20 bg-nocturne-dark px-3 text-sm text-white outline-none transition-smooth hover:border-nocturne-light/40 focus:border-nocturne-accent/50 focus:ring-2 focus:ring-nocturne-accent/20"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-zinc-300" htmlFor="password">
          Contrasena
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 h-11 w-full rounded-lg border border-nocturne-light/20 bg-nocturne-dark px-3 text-sm text-white outline-none transition-smooth hover:border-nocturne-light/40 focus:border-nocturne-accent/50 focus:ring-2 focus:ring-nocturne-accent/20"
        />
      </div>
      {error && <p className="rounded-lg border border-red-800 bg-red-950/40 px-3 py-2 text-sm text-red-200">{error}</p>}
      <button
        disabled={isPending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-nocturne-accent px-4 text-sm font-semibold text-nocturne-black transition-smooth hover:bg-nocturne-accent-light disabled:opacity-60"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
        Entrar al panel
      </button>
    </form>
  )
}
