'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export function Toast({
  tone = 'neutral',
  children,
}: {
  tone?: 'neutral' | 'success' | 'error'
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-lg border px-4 py-3 text-sm',
        tone === 'success' && 'border-green-700 bg-green-950/40 text-green-200',
        tone === 'error' && 'border-red-700 bg-red-950/40 text-red-200',
        tone === 'neutral' && 'border-white/10 bg-white/5 text-zinc-200',
      )}
    >
      {children}
    </div>
  )
}
