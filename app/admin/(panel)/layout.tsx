import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type React from 'react'

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="flex h-screen bg-nocturne-black text-white">
      <AdminSidebar name={session.name} role={session.role} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 pt-16 md:p-8">{children}</div>
      </main>
    </div>
  )
}
