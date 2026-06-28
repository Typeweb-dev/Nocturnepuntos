'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type React from 'react'

type LoginPayload = {
  success?: boolean
  message?: string
  profileUrl?: string
  customer?: {
    name: string
  }
}

export function CustomerCodeLogin() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'error' | 'success' | ''>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanCode = code.trim().toUpperCase()

    if (!cleanCode) {
      setMessage('Ingresa tu Codigo Nocturne.')
      setMessageType('error')
      return
    }

    setIsSubmitting(true)
    setMessage('')
    setMessageType('')

    try {
      const response = await fetch('/api/public/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode }),
      })
      const payload = (await response.json()) as LoginPayload

      if (!response.ok || !payload.success || !payload.profileUrl) {
        setMessage(payload.message ?? 'Codigo no encontrado. Revisa el ID de tu paquete.')
        setMessageType('error')
        return
      }

      setMessage(`Bienvenido, ${payload.customer?.name ?? 'Cliente Nocturne'}.`)
      setMessageType('success')

      window.setTimeout(() => {
        router.push(payload.profileUrl ?? `/puntos/${encodeURIComponent(cleanCode)}`)
      }, 650)
    } catch {
      setMessage('No pudimos validar tu codigo. Intenta de nuevo.')
      setMessageType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <form className="login-form" onSubmit={submit}>
        <div className="input-wrap">
          <input
            className="code-input"
            type="text"
            placeholder="Ingresa tu CodigoNocturne"
            autoComplete="off"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
          />

          <div className={`tooltip-box ${tooltipOpen ? 'open' : ''}`}>
            <button
              className="tooltip-btn"
              type="button"
              aria-label="Ayuda sobre el ID"
              onClick={(event) => {
                event.stopPropagation()
                setTooltipOpen((current) => !current)
              }}
              onBlur={() => setTooltipOpen(false)}
            >
              i
            </button>

            <div className="tooltip-text">ID que sale en tu paquete.</div>
          </div>
        </div>

        <button className="submit-btn" type="submit" aria-label="Ingresar" disabled={isSubmitting}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 5.5 19 12 4 18.5v-5l8-1.5-8-1.5v-5Z" />
          </svg>
        </button>
      </form>

      <p className={`message ${message ? 'show' : ''} ${messageType}`}>{message}</p>
    </>
  )
}
