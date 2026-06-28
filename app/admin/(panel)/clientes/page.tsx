import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { ClientesTable } from '@/components/admin/ClientesTable'
import { listCustomers } from '@/services/clientes.service'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams: Promise<{ search?: string }>
}

export default async function ClientesPage({ searchParams }: PageProps) {
  const { search } = await searchParams
  const customers = await listCustomers({ search })

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Clientes</h1>
          <p className="mt-2 text-nocturne-light">Busca, edita, bloquea y genera QR por cliente.</p>
        </div>
        <Link
          href="/admin/clientes/nuevo"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-nocturne-accent px-4 text-sm font-semibold text-nocturne-black transition-smooth hover:bg-nocturne-accent-light"
        >
          <Plus className="h-4 w-4" />
          Nuevo cliente
        </Link>
      </div>

      <form className="flex max-w-xl gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-nocturne-light" />
          <input
            name="search"
            defaultValue={search ?? ''}
            placeholder="Buscar por nombre, email, telefono o codigo"
            className="h-10 w-full rounded-lg border border-nocturne-light/20 bg-nocturne-darker pl-9 pr-3 text-sm text-white outline-none transition-smooth placeholder:text-nocturne-light hover:border-nocturne-light/40 focus:border-nocturne-accent/50"
          />
        </div>
        <button className="h-10 rounded-lg border border-nocturne-light/20 px-4 text-sm font-medium text-white transition-smooth hover:border-nocturne-accent/50 hover:bg-nocturne-darker">
          Buscar
        </button>
      </form>

      <ClientesTable customers={customers} />
    </div>
  )
}
