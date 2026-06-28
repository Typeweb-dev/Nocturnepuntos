import React from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-lg border border-nocturne-light/20 bg-nocturne-darker p-5 transition-smooth hover:border-nocturne-accent/40',
        className,
      )}
      {...props}
    />
  )
}
