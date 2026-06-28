import React from 'react'

interface GlowCardProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
  glowStrong?: boolean
}

export function GlowCard({ children, className = '', glow = true, glowStrong = false }: GlowCardProps) {
  return (
    <div
      className={`
        rounded-lg border border-white/10 bg-white/5 backdrop-blur-md
        transition-smooth hover:border-white/20 hover:bg-white/10
        ${glowStrong ? 'glow-accent-strong' : glow ? 'glow-accent' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
