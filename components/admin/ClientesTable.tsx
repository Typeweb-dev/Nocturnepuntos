import Link from 'next/link'
import { QrCode } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'

type CustomerRow = {
  id: string
  code: string
  name: string
  email: string | null
  phone: string | null
  pointsBalance: number
  status: string
  createdAt: Date
}

export function ClientesTable({ customers }: { customers: CustomerRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-nocturne-light/20 bg-nocturne-darker">
      <table className="w-full text-sm">
        <thead className="border-b border-nocturne-light/20 bg-nocturne-dark text-left text-xs uppercase tracking-[0.14em] text-nocturne-light">
          <tr>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Contacto</th>
            <th className="px-4 py-3 text-right">Puntos</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Alta</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {customers.map((customer) => (
            <tr key={customer.id} className="transition-smooth hover:bg-nocturne-light/5">
              <td className="px-4 py-3">
                <Link href={`/admin/clientes/${customer.id}`} className="font-medium text-white hover:text-nocturne-accent">
                  {customer.name}
                </Link>
                <p className="font-mono text-xs text-nocturne-light">{customer.code}</p>
              </td>
              <td className="px-4 py-3 text-nocturne-light">
                <p>{customer.email ?? 'Sin email'}</p>
                <p className="text-xs text-nocturne-light/70">{customer.phone ?? 'Sin telefono'}</p>
              </td>
              <td className="px-4 py-3 text-right font-mono text-white">{customer.pointsBalance}</td>
              <td className="px-4 py-3"><StatusBadge status={customer.status} /></td>
              <td className="px-4 py-3 text-nocturne-light">{customer.createdAt.toLocaleDateString('es-NI')}</td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/qrs/generar?customerId=${customer.id}`}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-nocturne-light/20 px-3 text-xs text-white transition-smooth hover:border-nocturne-accent/50 hover:bg-nocturne-dark"
                >
                  <QrCode className="h-3.5 w-3.5" />
                  QR
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {customers.length === 0 && <p className="py-10 text-center text-sm text-nocturne-light">No hay clientes para mostrar.</p>}
    </div>
  )
}
