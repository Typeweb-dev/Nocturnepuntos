import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, QrCode } from 'lucide-react'
import { CustomerForm } from '@/components/admin/CustomerForm'
import { PointsAdjustForm } from '@/components/admin/PointsAdjustForm'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { getCustomerById } from '@/services/clientes.service'
import { formatDateTime } from '@/lib/utils-nocturne'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const { id } = await params
  const customer = await getCustomerById(id)

  if (!customer) {
    notFound()
  }
  const customerFormData = {
    id: customer.id,
    code: customer.code,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    pointsBalance: customer.pointsBalance,
    status: customer.status,
  }

  return (
    <div className="space-y-8">
      <Link href="/admin/clientes" className="inline-flex items-center gap-2 text-sm text-nocturne-accent transition-smooth hover:text-nocturne-accent-light">
        <ArrowLeft className="h-4 w-4" />
        Volver a clientes
      </Link>

      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{customer.name}</h1>
            <StatusBadge status={customer.status} />
          </div>
          <p className="mt-2 font-mono text-sm text-nocturne-accent">{customer.code}</p>
        </div>
        <Link
          href={`/admin/qrs/generar?customerId=${customer.id}`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-nocturne-accent px-4 text-sm font-semibold text-nocturne-black transition-smooth hover:bg-nocturne-accent-light"
        >
          <QrCode className="h-4 w-4" />
          Generar QR
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-nocturne-light">Balance</p>
          <p className="mt-2 text-4xl font-bold text-white">{customer.pointsBalance}</p>
        </Card>
        <Card>
          <p className="text-sm text-nocturne-light">Contacto</p>
          <p className="mt-2 text-white">{customer.email ?? 'Sin email'}</p>
          <p className="text-sm text-nocturne-light">{customer.phone ?? 'Sin telefono'}</p>
        </Card>
        <Card>
          <p className="text-sm text-nocturne-light">Registro</p>
          <p className="mt-2 text-white">{customer.createdAt.toLocaleDateString('es-NI')}</p>
          <p className="text-sm text-nocturne-light">Actualizado {customer.updatedAt.toLocaleDateString('es-NI')}</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card>
            <h2 className="mb-5 text-lg font-semibold text-white">Editar cliente</h2>
            <CustomerForm customer={customerFormData} />
          </Card>

          <Card>
            <h2 className="mb-5 text-lg font-semibold text-white">Historial de puntos</h2>
            <div className="divide-y divide-white/10">
              {customer.transactions.map((transaction) => (
                <div key={transaction.id} className="grid gap-2 py-3 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                  <div>
                    <p className="text-white">{transaction.description}</p>
                    <p className="text-xs text-nocturne-light">{transaction.type}</p>
                  </div>
                  <p className={transaction.points >= 0 ? 'font-mono text-sm text-green-300' : 'font-mono text-sm text-red-300'}>
                    {transaction.points > 0 ? '+' : ''}
                    {transaction.points}
                  </p>
                  <p className="text-xs text-nocturne-light">{formatDateTime(transaction.createdAt.toISOString())}</p>
                </div>
              ))}
              {customer.transactions.length === 0 && <p className="py-8 text-center text-sm text-nocturne-light">Sin movimientos.</p>}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-5 text-lg font-semibold text-white">Ajuste manual</h2>
            <PointsAdjustForm customerId={customer.id} />
          </Card>

          <Card>
            <h2 className="mb-5 text-lg font-semibold text-white">QR recientes</h2>
            <div className="space-y-3">
              {customer.rewardQrs.map((qr) => (
                <div key={qr.id} className="rounded-lg border border-nocturne-light/10 bg-nocturne-dark p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-sm text-white">{qr.points} pts</p>
                    <StatusBadge status={qr.status} />
                  </div>
                  <p className="mt-2 text-xs text-nocturne-light">Expira {qr.expiresAt.toLocaleDateString('es-NI')}</p>
                </div>
              ))}
              {customer.rewardQrs.length === 0 && <p className="text-sm text-nocturne-light">Sin QR generados.</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
