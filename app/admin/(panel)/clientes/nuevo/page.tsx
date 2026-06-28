import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CustomerForm } from '@/components/admin/CustomerForm'
import { Card } from '@/components/ui/Card'

export default function NuevoClientePage() {
  return (
    <div className="max-w-4xl space-y-8">
      <Link href="/admin/clientes" className="inline-flex items-center gap-2 text-sm text-nocturne-accent transition-smooth hover:text-nocturne-accent-light">
        <ArrowLeft className="h-4 w-4" />
        Volver a clientes
      </Link>
      <div>
        <h1 className="text-3xl font-bold text-white">Nuevo cliente</h1>
        <p className="mt-2 text-nocturne-light">Crea una cuenta de puntos con codigo unico.</p>
      </div>
      <Card>
        <CustomerForm />
      </Card>
    </div>
  )
}
