import React from 'react'
import { generateMockQRCode } from '@/lib/utils-nocturne'
import { Copy, Download, Printer } from 'lucide-react'

interface QRPreviewCardProps {
  code: string
  pointsValue: number
  expiresAt: string
}

export function QRPreviewCard({ code, pointsValue, expiresAt }: QRPreviewCardProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg border border-nocturne-light/20 bg-nocturne-darker p-6">
      <h3 className="mb-6 text-lg font-semibold text-white">QR Code Preview</h3>

      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        {/* QR Code */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="rounded-lg border border-nocturne-light/20 bg-white p-4"
            dangerouslySetInnerHTML={{
              __html: generateMockQRCode(code),
            }}
          />
          <p className="text-sm font-mono text-nocturne-light">{code}</p>
        </div>

        {/* Details */}
        <div className="flex-1 space-y-6">
          <div>
            <p className="text-sm text-nocturne-light">Points Value</p>
            <p className="mt-2 text-3xl font-bold text-nocturne-accent">{pointsValue}</p>
          </div>

          <div>
            <p className="text-sm text-nocturne-light">Expires</p>
            <p className="mt-2 font-medium text-white">{expiresAt}</p>
          </div>

          <div className="space-y-2 pt-4">
            <button
              onClick={handleCopy}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-nocturne-light/20 bg-nocturne-dark px-4 py-2 font-medium text-white transition-smooth hover:border-nocturne-accent/50 hover:bg-nocturne-darker"
            >
              <Copy className="h-4 w-4" />
              {copied ? 'Copied!' : 'Copy Code'}
            </button>

            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-nocturne-light/20 bg-nocturne-dark px-4 py-2 font-medium text-white transition-smooth hover:border-nocturne-accent/50 hover:bg-nocturne-darker">
              <Download className="h-4 w-4" />
              Download
            </button>

            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-nocturne-light/20 bg-nocturne-dark px-4 py-2 font-medium text-white transition-smooth hover:border-nocturne-accent/50 hover:bg-nocturne-darker">
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
