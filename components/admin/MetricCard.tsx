import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  className?: string
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  trend = 'neutral',
  trendValue,
  className = '',
}: MetricCardProps) {
  const trendClass =
    trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-nocturne-light'

  return (
    <div
      className={`
        rounded-lg border border-nocturne-light/20 bg-nocturne-darker p-6
        transition-smooth hover:border-nocturne-accent/40 hover:bg-nocturne-dark
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-nocturne-light">{label}</p>
          <p className="mt-3 text-3xl font-bold text-white">{value}</p>
          {trendValue && <p className={`mt-2 text-xs font-medium ${trendClass}`}>{trendValue}</p>}
        </div>
        <div className="rounded-lg bg-nocturne-accent/20 p-3">
          <Icon className="h-6 w-6 text-nocturne-accent" />
        </div>
      </div>
    </div>
  )
}
