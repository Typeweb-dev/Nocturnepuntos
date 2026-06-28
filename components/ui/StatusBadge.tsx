import React from 'react'
import { getStatusBadgeColor } from '@/lib/utils-nocturne'

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const { bg, text, border } = getStatusBadgeColor(status)
  const label = status
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

  return (
    <span
      className={`
        inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
        border transition-smooth
        ${bg} ${text} ${border}
        ${className}
      `}
    >
      {label}
    </span>
  )
}
