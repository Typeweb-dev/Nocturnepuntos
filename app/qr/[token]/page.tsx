import Link from 'next/link'
import { QRAutoClaim } from '@/components/public/QRAutoClaim'
import { getQrClaimPreview } from '@/services/qr.service'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ token: string }>
}

export default async function QRClaimPage({ params }: PageProps) {
  const { token } = await params
  const decodedToken = decodeURIComponent(token)
  const preview = await getQrClaimPreview(decodedToken)

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.12),transparent_34%),#000]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
        {preview.state === 'invalid' ? (
          <div className="rounded-lg border border-white/15 bg-black/70 p-6 text-center shadow-2xl shadow-black">
            <h1 className="text-2xl font-black text-white">QR invalido</h1>
            <p className="mt-3 text-sm text-white/70">{preview.message}</p>
            <Link href="/" className="mt-5 inline-flex rounded-full bg-white px-5 py-2 text-sm font-black text-black">
              Ir al login
            </Link>
          </div>
        ) : (
          <QRAutoClaim token={decodedToken} />
        )}
      </div>
    </main>
  )
}
