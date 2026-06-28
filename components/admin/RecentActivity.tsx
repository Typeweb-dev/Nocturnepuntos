import Link from 'next/link'
import { Activity as ActivityIcon, Gift, QrCode, Settings, ShoppingBag } from 'lucide-react'
import { formatDateTime } from '@/lib/utils-nocturne'

type Activity = {
  id: string
  customerId: string
  customerName: string
  type: string
  pointsChange: number
  description: string
  timestamp: string
}

export function RecentActivity({ activities }: { activities: Activity[] }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'EARN':
        return <QrCode className="h-5 w-5" />
      case 'REDEEM':
        return <Gift className="h-5 w-5" />
      case 'ADJUST':
        return <Settings className="h-5 w-5" />
      case 'CANCEL':
      case 'EXPIRE':
        return <ShoppingBag className="h-5 w-5" />
      default:
        return <ActivityIcon className="h-5 w-5" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'EARN':
        return 'text-green-400'
      case 'REDEEM':
        return 'text-nocturne-accent'
      case 'ADJUST':
        return 'text-nocturne-cyan'
      case 'CANCEL':
      case 'EXPIRE':
        return 'text-red-400'
      default:
        return 'text-nocturne-light'
    }
  }

  return (
    <div className="rounded-lg border border-nocturne-light/20 bg-nocturne-darker p-6">
      <h3 className="mb-6 text-lg font-semibold text-white">Actividad reciente</h3>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 pb-4 last:pb-0">
            <div className={`rounded-lg bg-nocturne-dark p-2 ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>

            <div className="min-w-0 flex-1">
              <Link href={`/admin/clientes/${activity.customerId}`} className="font-medium text-white hover:text-nocturne-accent">
                {activity.customerName}
              </Link>
              <p className="text-sm text-nocturne-light">{activity.description}</p>
              <p className="mt-1 text-xs text-nocturne-light/70">{formatDateTime(activity.timestamp)}</p>
            </div>

            <div
              className={`shrink-0 text-right font-semibold ${
                activity.pointsChange > 0
                  ? 'text-green-400'
                  : activity.pointsChange < 0
                    ? 'text-red-400'
                    : 'text-nocturne-light'
              }`}
            >
              {activity.pointsChange > 0 ? '+' : ''}
              {activity.pointsChange} pts
            </div>
          </div>
        ))}
        {activities.length === 0 && <p className="py-8 text-center text-sm text-nocturne-light">Aun no hay actividad.</p>}
      </div>

      <div className="mt-6 pt-6">
        <Link
          href="/admin/clientes"
          className="inline-flex items-center text-sm font-medium text-nocturne-accent transition-smooth hover:text-nocturne-accent-light"
        >
          Ver clientes
        </Link>
      </div>
    </div>
  )
}
