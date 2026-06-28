import { Suspense } from 'react'
import Link from 'next/link'
import { LoginForm } from '@/components/admin/LoginForm'
import { Card } from '@/components/ui/Card'

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-nocturne-black px-4 py-10 text-white">
      <div className="grid-pattern fixed inset-0 opacity-20" />
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center">
        <Link href="/" className="mb-8 inline-flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-nocturne-accent shadow-[0_0_28px_rgba(255,31,126,0.35)]" />
          <div>
            <p className="font-bold">Nocturne</p>
            <p className="text-xs text-nocturne-light">Admin</p>
          </div>
        </Link>
        <Card>
          <h1 className="text-2xl font-bold">Entrar al panel</h1>
          <p className="mt-2 text-sm text-nocturne-light">Gestiona clientes, QR, puntos y canjes.</p>
          <div className="mt-6">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
        </Card>
      </div>
    </main>
  )
}
