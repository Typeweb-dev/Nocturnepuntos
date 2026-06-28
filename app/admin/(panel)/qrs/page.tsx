import Link from 'next/link'
import { Download, Plus, QrCode } from 'lucide-react'
import { RewardQrStatus } from '@prisma/client'
import { RevokeQrButton } from '@/components/admin/RevokeQrButton'
import { BentoCard } from '@/components/ui/BentoCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { listRewardQrs } from '@/services/qr.service'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams: Promise<{ status?: string }>
}

const filters = ['ALL', 'PENDING', 'CLAIMED', 'EXPIRED', 'REVOKED']

export default async function QRsPage({ searchParams }: PageProps) {
  const { status } = await searchParams
  const selectedStatus =
    status && status !== 'ALL' && Object.values(RewardQrStatus).includes(status as RewardQrStatus)
      ? (status as RewardQrStatus)
      : undefined
  const qrs = await listRewardQrs({ status: selectedStatus })

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">QR Codes</h1>
          <p className="mt-2 text-nocturne-light">Gestiona codigos QR, vencimientos, descargas y anulaciones.</p>
        </div>
        <Link
          href="/admin/qrs/generar"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-nocturne-accent px-4 text-sm font-semibold text-nocturne-black transition-smooth hover:bg-nocturne-accent-light"
        >
          <Plus className="h-5 w-5" />
          Generar QR
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {filters.map((filter) => (
          <Link
            key={filter}
            href={filter === 'ALL' ? '/admin/qrs' : `/admin/qrs?status=${filter}`}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-smooth ${
              (filter === 'ALL' && !status) || status === filter
                ? 'border-nocturne-accent/50 bg-nocturne-accent/10 text-nocturne-accent'
                : 'border-nocturne-light/20 text-nocturne-light hover:border-nocturne-accent/50 hover:text-white'
            }`}
          >
            {filter === 'ALL' ? 'Todos' : filter}
          </Link>
        ))}
      </div>

      <div className="grid gap-4">
        {qrs.map((qr) => (
          <BentoCard key={qr.id} variant="default">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-nocturne-accent/10 p-3">
                  <QrCode className="h-6 w-6 text-nocturne-accent" />
                </div>
                <div>
                  <p className="font-mono font-semibold text-white">QR-{qr.id.slice(-6).toUpperCase()}</p>
                  <p className="mt-1 text-sm text-nocturne-light">
                    {qr.customer.code} - {qr.customer.name}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-nocturne-light">
                    <span>{qr.points} puntos</span>
                    <span>Expira: {qr.expiresAt.toLocaleDateString('es-NI')}</span>
                    <span>Escaneos: {qr.scanCount}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                <StatusBadge status={qr.status} />
                <a
                  href={`/api/qrs/${qr.id}/png`}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-nocturne-light/20 px-3 text-sm font-medium text-white transition-smooth hover:border-nocturne-accent/50 hover:bg-nocturne-dark"
                >
                  <Download className="h-4 w-4" />
                  PNG
                </a>
                <RevokeQrButton qrId={qr.id} disabled={qr.status !== 'PENDING'} />
              </div>
            </div>
          </BentoCard>
        ))}
      </div>

      {qrs.length === 0 && (
        <BentoCard variant="default">
          <p className="py-8 text-center text-sm text-nocturne-light">No hay QR para este filtro.</p>
        </BentoCard>
      )}
    </div>
  )
}
