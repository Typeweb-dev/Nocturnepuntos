'use client'

import React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ModalProps = {
  open: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
}

export function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className={cn('w-full max-w-lg rounded-lg border border-nocturne-light/20 bg-nocturne-darker p-5 shadow-2xl shadow-black')}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button className="rounded-lg p-2 text-nocturne-light transition-smooth hover:bg-nocturne-dark hover:text-white" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
