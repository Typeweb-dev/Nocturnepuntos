'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Gift, Home, LogOut, Menu, QrCode, Settings, Users, X } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: Home },
  { label: 'Clientes', href: '/admin/clientes', icon: Users },
  { label: 'QR', href: '/admin/qrs', icon: QrCode },
  { label: 'Canjes', href: '/admin/canjes', icon: Gift },
  { label: 'Configuracion', href: '/admin/configuracion', icon: Settings },
]

export function AdminSidebar({ name, role }: { name?: string; role?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-nocturne-darker p-2 md:hidden"
        aria-label={isOpen ? 'Cerrar menu' : 'Abrir menu'}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />}

      <aside
        className={`
          fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-nocturne-light/20 bg-[#0A0A0A]
          transition-transform duration-300 ease-out
          md:relative md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="border-b border-nocturne-light/20 p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-nocturne-accent shadow-[0_0_24px_rgba(255,31,126,0.35)]" />
            <span className="text-lg font-bold text-white">Nocturne</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 rounded-lg px-4 py-3 transition-smooth
                  ${
                    active
                      ? 'border border-nocturne-accent/50 bg-nocturne-accent/10 text-nocturne-accent'
                      : 'text-nocturne-light hover:bg-nocturne-darker hover:text-white'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="space-y-3 border-t border-nocturne-light/20 p-4">
          {name && (
            <div className="rounded-lg border border-nocturne-light/10 bg-nocturne-darker px-4 py-3">
              <p className="truncate text-sm font-medium text-white">{name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-nocturne-light">{role}</p>
            </div>
          )}
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-nocturne-light transition-smooth hover:bg-nocturne-darker hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Salir</span>
          </button>
        </div>
      </aside>
    </>
  )
}
