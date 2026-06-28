import React from 'react'

interface BentoCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'featured' | 'minimal'
}

export function BentoCard({ children, className = '', variant = 'default' }: BentoCardProps) {
  const variantStyles = {
    default: 'bg-nocturne-darker border border-nocturne-light/20',
    featured: 'bg-gradient-to-br from-nocturne-dark to-nocturne-darker border border-nocturne-accent/30',
    minimal: 'bg-transparent border border-nocturne-light/10',
  }

  return (
    <div
      className={`
        rounded-lg p-6 transition-smooth
        ${variantStyles[variant]}
        hover:border-nocturne-accent/50
        ${className}
      `}
    >
      {children}
    </div>
  )
}
