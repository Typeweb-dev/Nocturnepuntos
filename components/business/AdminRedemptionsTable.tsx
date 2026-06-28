'use client'

import { useState } from 'react'
import { Check, CheckCheck, X, Eye } from 'lucide-react'
import { mockCatalogRedemptions, type CatalogRedemption } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils-nocturne'

const statusStyles: Record<CatalogRedemption['status'], string> = {
  PENDING: 'border-yellow-700 bg-yellow-950/40 text-yellow-400',
  APPROVED: 'border-blue-700 bg-blue-950/40 text-blue-400',
  COMPLETED: 'border-emerald-700 bg-emerald-950/40 text-emerald-400',
  CANCELLED: 'border-red-700 bg-red-950/40 text-red-400',
}

const statusLabel: Record<CatalogRedemption['status'], string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
}

export function AdminRedemptionsTable() {
  const [rows, setRows] = useState<CatalogRedemption[]>(mockCatalogRedemptions)
  const [selected, setSelected] = useState<CatalogRedemption | null>(null)

  const updateStatus = (id: string, status: CatalogRedemption['status']) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-nocturne-light/15 bg-nocturne-darker">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-nocturne-light/15 text-xs uppercase tracking-wide text-nocturne-light">
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Código</th>
              <th className="px-4 py-3 font-medium">Recompensa</th>
              <th className="px-4 py-3 font-medium">Puntos</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-nocturne-light/10 transition-smooth last:border-0 hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3 font-medium text-white">{row.customer}</td>
                <td className="px-4 py-3 font-mono text-xs text-nocturne-light">{row.customerCode}</td>
                <td className="px-4 py-3 text-nocturne-light">{row.reward}</td>
                <td className="px-4 py-3 font-semibold text-nocturne-accent">{row.pointsUsed}</td>
                <td className="px-4 py-3 text-nocturne-light">{formatDate(row.requestedAt)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[row.status]}`}
                  >
                    {statusLabel[row.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => updateStatus(row.id, 'APPROVED')}
                      disabled={row.status !== 'PENDING'}
                      title="Aprobar"
                      className="rounded-md p-1.5 text-green-400 transition-smooth hover:bg-green-950/40 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => updateStatus(row.id, 'COMPLETED')}
                      disabled={row.status === 'COMPLETED' || row.status === 'CANCELLED'}
                      title="Marcar como completado"
                      className="rounded-md p-1.5 text-emerald-400 transition-smooth hover:bg-emerald-950/40 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <CheckCheck className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => updateStatus(row.id, 'CANCELLED')}
                      disabled={row.status === 'COMPLETED' || row.status === 'CANCELLED'}
                      title="Cancelar"
                      className="rounded-md p-1.5 text-red-400 transition-smooth hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setSelected(row)}
                      title="Ver detalle"
                      className="rounded-md p-1.5 text-nocturne-light transition-smooth hover:bg-white/5 hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            aria-label="Cerrar"
            onClick={() => setSelected(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-nocturne-light/20 bg-nocturne-darker p-6 glow-accent">
            <h3 className="text-lg font-bold text-white">Detalle del canje</h3>
            <p className="mt-1 font-mono text-xs text-nocturne-light">{selected.id}</p>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-nocturne-light">Cliente</span>
                <span className="font-medium text-white">{selected.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nocturne-light">Código</span>
                <span className="font-mono text-white">{selected.customerCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nocturne-light">Recompensa</span>
                <span className="font-medium text-white">{selected.reward}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nocturne-light">Puntos usados</span>
                <span className="font-semibold text-nocturne-accent">{selected.pointsUsed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nocturne-light">Fecha</span>
                <span className="text-white">{formatDate(selected.requestedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nocturne-light">Estado</span>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[selected.status]}`}
                >
                  {statusLabel[selected.status]}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-lg bg-nocturne-accent px-4 py-2.5 text-sm font-semibold text-nocturne-black transition-smooth hover:bg-nocturne-accent-light"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
