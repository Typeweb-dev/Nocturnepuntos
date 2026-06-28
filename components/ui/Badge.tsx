import React from 'react'
import { cn } from '@/lib/utils'

const tones = {
  neutral: 'border-zinc-700 bg-zinc-900 text-zinc-300',
  blue: 'border-cyan-700 bg-cyan-950/50 text-nocturne-cyan',
  green: 'border-green-700 bg-green-950/50 text-green-300',
  amber: 'border-amber-700 bg-amber-950/50 text-amber-300',
  red: 'border-red-700 bg-red-950/50 text-red-300',
}

export function Badge({
  tone = 'neutral',
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', tones[tone], className)}
      {...props}
    />
  )
}
