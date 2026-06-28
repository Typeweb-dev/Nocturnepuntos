import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { QRGeneratorForm } from '@/components/admin/QRGeneratorForm'
import { getDefaultPointsPerQr, getDefaultQrExpirationDays } from '@/lib/env'
import { listCustomers } from '@/services/clientes.service'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams: Promise<{ customerId?: string }>
}

export default async function GenerarQRPage({ searchParams }: PageProps) {
  const [{ customerId }, customers] = await Promise.all([
    searchParams,
    listCustomers(),
  ])
  const customerOptions = customers.map((customer) => ({
    id: customer.id,
    code: customer.code,
    name: customer.name,
  }))

  return (
    <div className="space-y-8">
      <Link href="/admin/qrs" className="inline-flex items-center gap-2 text-sm text-nocturne-accent transition-smooth hover:text-nocturne-accent-light">
        <ArrowLeft className="h-4 w-4" />
        Volver a QR
      </Link>
      <div>
        <h1 className="text-3xl font-bold text-white">Generar QR Code</h1>
        <p className="mt-2 text-nocturne-light">Crea un token unico para sumar puntos al escanear.</p>
      </div>
      <QRGeneratorForm
        customers={customerOptions}
        defaultPoints={getDefaultPointsPerQr()}
        defaultExpirationDays={getDefaultQrExpirationDays()}
        initialCustomerId={customerId}
      />
    </div>
  )
}
