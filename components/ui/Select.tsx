import React from 'react'
import { cn } from '@/lib/utils'

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-lg border border-nocturne-light/20 bg-nocturne-dark px-3 text-sm text-white outline-none transition-smooth hover:border-nocturne-light/40 focus:border-nocturne-accent/50 focus:ring-2 focus:ring-nocturne-accent/20',
        className,
      )}
      {...props}
    />
  )
}
