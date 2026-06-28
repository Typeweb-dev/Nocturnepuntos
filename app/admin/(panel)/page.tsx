import Link from 'next/link'
import { Award, Bell, CheckCircle2, QrCode, TrendingUp, Users, Zap } from 'lucide-react'
import { DashboardChart } from '@/components/admin/DashboardChart'
import { MetricCard } from '@/components/admin/MetricCard'
import { RecentActivity } from '@/components/admin/RecentActivity'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { BentoCard } from '@/components/ui/BentoCard'
import { formatDateTime } from '@/lib/utils-nocturne'
import { getDashboardMetrics } from '@/services/dashboard.service'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const dashboard = await getDashboardMetrics()
  const recentActivities = dashboard.latestTransactions.map((transaction) => ({
    id: transaction.id,
    customerId: transaction.customerId,
    customerName: transaction.customer.name,
    type: transaction.type,
    pointsChange: transaction.points,
    description: transaction.description,
    timestamp: transaction.createdAt.toISOString(),
  }))
  const notifications = [
    ...dashboard.latestClaimedQrs.map((qr) => ({
      id: `qr-${qr.id}`,
      title: 'QR escaneado',
      description: `${qr.customer.name} (${qr.customer.code}) recibio ${qr.points} puntos.`,
      value: `+${qr.points} pts`,
      timestamp: qr.claimedAt?.toISOString() ?? qr.updatedAt.toISOString(),
      tone: 'text-green-300',
    })),
    ...dashboard.latestRedemptions.map((redemption) => ({
      id: `redemption-${redemption.id}`,
      title: 'Canje solicitado',
      description: `${redemption.customer.name} pidio ${redemption.rewardName}.`,
      value: `-${redemption.pointsUsed} pts`,
      timestamp: redemption.createdAt.toISOString(),
      tone: 'text-red-300',
    })),
  ]
    .sort((first, second) => new Date(second.timestamp).getTime() - new Date(first.timestamp).getTime())
    .slice(0, 8)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-nocturne-light">Resumen operativo del sistema de puntos Nocturne.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard label="Clientes totales" value={dashboard.totalCustomers} icon={Users} trend="neutral" trendValue="Cuentas registradas" />
        <MetricCard
          label="Puntos entregados"
          value={dashboard.totalPointsDelivered.toLocaleString('es-NI')}
          icon={Award}
          trend="up"
          trendValue="Historial positivo"
        />
        <MetricCard label="QR generados" value={dashboard.qrGenerated} icon={QrCode} trend="neutral" trendValue={`${dashboard.qrPending} pendientes`} />
        <MetricCard label="Canjes activos" value={dashboard.pendingRedemptions} icon={Zap} trend="up" trendValue="Pendientes o aprobados" />
        <MetricCard
          label="QR usados"
          value={dashboard.qrClaimed}
          icon={CheckCircle2}
          trend="neutral"
          trendValue={`${dashboard.qrExpired} expirados`}
        />
        <MetricCard label="Promedio por cliente" value={dashboard.averagePointsPerCustomer} icon={TrendingUp} trend="neutral" trendValue="Puntos entregados" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardChart data={dashboard.chartData} />
        </div>

        <BentoCard variant="default">
          <h3 className="mb-6 text-lg font-semibold text-white">Top clientes</h3>
          <div className="space-y-4">
            {dashboard.topCustomers.map((customer) => (
              <Link key={customer.id} href={`/admin/clientes/${customer.id}`} className="flex items-center justify-between pb-4 last:pb-0">
                <div>
                  <p className="font-medium text-white">{customer.name}</p>
                  <p className="font-mono text-sm text-nocturne-light">{customer.code}</p>
                </div>
                <p className="font-bold text-nocturne-accent">{customer.pointsBalance}</p>
              </Link>
            ))}
            {dashboard.topCustomers.length === 0 && <p className="text-sm text-nocturne-light">Aun no hay clientes.</p>}
          </div>
        </BentoCard>
      </div>

      <BentoCard variant="default">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-nocturne-accent/10 text-nocturne-accent">
              <Bell className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-white">Notificaciones recientes</h3>
              <p className="text-sm text-nocturne-light">Escaneos de QR y canjes solicitados por clientes.</p>
            </div>
          </div>
          <Link href="/admin/canjes" className="text-sm font-medium text-nocturne-accent transition-smooth hover:text-nocturne-accent-light">
            Ver canjes
          </Link>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {notifications.map((notification) => (
            <div key={notification.id} className="rounded-lg border border-nocturne-light/10 bg-nocturne-dark p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">{notification.title}</p>
                  <p className="mt-1 text-sm text-nocturne-light">{notification.description}</p>
                  <p className="mt-3 text-xs text-nocturne-light/70">{formatDateTime(notification.timestamp)}</p>
                </div>
                <span className={`shrink-0 font-mono text-sm font-bold ${notification.tone}`}>{notification.value}</span>
              </div>
            </div>
          ))}
          {notifications.length === 0 && <p className="py-8 text-center text-sm text-nocturne-light lg:col-span-2">Aun no hay notificaciones.</p>}
        </div>
      </BentoCard>

      <RecentActivity activities={recentActivities} />

      <BentoCard variant="default">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-white">Ultimos QR generados</h3>
          <Link href="/admin/qrs" className="text-sm font-medium text-nocturne-accent transition-smooth hover:text-nocturne-accent-light">
            Ver QR
          </Link>
        </div>
        <div className="grid gap-3">
          {dashboard.latestQrs.map((qr) => (
            <div key={qr.id} className="flex flex-col gap-3 rounded-lg border border-nocturne-light/10 bg-nocturne-dark p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium text-white">
                  {qr.customer.code} - {qr.customer.name}
                </p>
                <p className="mt-1 text-sm text-nocturne-light">
                  {qr.points} pts / expira {qr.expiresAt.toLocaleDateString('es-NI')}
                </p>
              </div>
              <StatusBadge status={qr.status} />
            </div>
          ))}
          {dashboard.latestQrs.length === 0 && <p className="py-8 text-center text-sm text-nocturne-light">No hay QR generados.</p>}
        </div>
      </BentoCard>
    </div>
  )
}
