export function getMembershipColor(level: string): string {
  switch (level) {
    case 'platinum':
      return 'text-yellow-400'
    case 'gold':
      return 'text-amber-400'
    case 'silver':
      return 'text-slate-300'
    case 'bronze':
      return 'text-orange-400'
    default:
      return 'text-gray-400'
  }
}

export function getMembershipBgColor(level: string): string {
  switch (level) {
    case 'platinum':
      return 'bg-yellow-950'
    case 'gold':
      return 'bg-amber-950'
    case 'silver':
      return 'bg-slate-800'
    case 'bronze':
      return 'bg-orange-950'
    default:
      return 'bg-gray-800'
  }
}

export function getStatusBadgeColor(status: string): {
  bg: string
  text: string
  border: string
} {
  switch (status.toLowerCase()) {
    case 'active':
      return { bg: 'bg-green-950', text: 'text-green-400', border: 'border-green-700' }
    case 'pending':
      return { bg: 'bg-yellow-950', text: 'text-yellow-400', border: 'border-yellow-700' }
    case 'claimed':
      return { bg: 'bg-cyan-950', text: 'text-nocturne-cyan', border: 'border-cyan-700' }
    case 'inactive':
      return { bg: 'bg-gray-800', text: 'text-gray-400', border: 'border-gray-700' }
    case 'suspended':
    case 'blocked':
      return { bg: 'bg-red-950', text: 'text-red-400', border: 'border-red-700' }
    case 'expired':
      return { bg: 'bg-red-950', text: 'text-red-400', border: 'border-red-700' }
    case 'revoked':
      return { bg: 'bg-red-950', text: 'text-red-400', border: 'border-red-700' }
    case 'fulfilled':
      return { bg: 'bg-emerald-950', text: 'text-emerald-400', border: 'border-emerald-700' }
    case 'approved':
      return { bg: 'bg-cyan-950', text: 'text-nocturne-cyan', border: 'border-cyan-700' }
    case 'rejected':
    case 'cancelled':
      return { bg: 'bg-red-950', text: 'text-red-400', border: 'border-red-700' }
    case 'completed':
      return { bg: 'bg-emerald-950', text: 'text-emerald-400', border: 'border-emerald-700' }
    case 'draft':
      return { bg: 'bg-zinc-900', text: 'text-zinc-300', border: 'border-zinc-700' }
    case 'paid':
      return { bg: 'bg-cyan-950', text: 'text-nocturne-cyan', border: 'border-cyan-700' }
    default:
      return { bg: 'bg-gray-800', text: 'text-gray-400', border: 'border-gray-700' }
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-NI', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-NI', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function calculateProgress(used: number, total: number): number {
  if (total === 0) return 0
  return Math.round((used / total) * 100)
}

export function getActivityIcon(type: string): string {
  switch (type) {
    case 'qr_claimed':
      return 'QrCode'
    case 'points_redeemed':
      return 'Gift'
    case 'membership_upgraded':
      return 'Crown'
    case 'purchase':
      return 'ShoppingBag'
    case 'admin_adjustment':
      return 'Settings'
    default:
      return 'Activity'
  }
}

export function getActivityColor(type: string): string {
  switch (type) {
    case 'qr_claimed':
      return 'text-cyan-400'
    case 'points_redeemed':
      return 'text-amber-400'
    case 'membership_upgraded':
      return 'text-yellow-400'
    case 'purchase':
      return 'text-purple-400'
    case 'admin_adjustment':
      return 'text-pink-400'
    default:
      return 'text-gray-400'
  }
}

export function generateMockQRCode(code: string): string {
  // Generate a simple QR-like SVG for demo purposes
  const colors = ['#ff1f7e', '#00d9ff', '#d4af37', '#ff4b9f']
  const randomColor = colors[Math.floor(Math.random() * colors.length)]

  return `
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#050505"/>
      <rect x="10" y="10" width="60" height="60" fill="${randomColor}" opacity="0.8"/>
      <rect x="130" y="10" width="60" height="60" fill="${randomColor}" opacity="0.8"/>
      <rect x="10" y="130" width="60" height="60" fill="${randomColor}" opacity="0.8"/>
      ${Array.from({ length: 64 }).map((_, i) => {
        const x = 70 + (i % 4) * 30
        const y = 70 + Math.floor(i / 4) * 30
        const fill = Math.random() > 0.5 ? randomColor : '#111111'
        return `<rect x="${x}" y="${y}" width="20" height="20" fill="${fill}" opacity="0.9"/>`
      }).join('')}
      <text x="100" y="190" font-family="monospace" font-size="10" fill="#999" text-anchor="middle">${code}</text>
    </svg>
  `
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
