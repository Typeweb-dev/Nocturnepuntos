import React from 'react'
import { cn } from '@/lib/utils'

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn('w-full text-sm', className)} {...props} />
}

export function TableShell({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('overflow-x-auto rounded-lg border border-nocturne-light/20 bg-nocturne-darker', className)}
      {...props}
    />
  )
}
