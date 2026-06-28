import { WHATSAPP_URL } from '@/lib/company'

type RedemptionWhatsAppInput = {
  customer: {
    name: string
    code: string
    email?: string | null
    phone?: string | null
    pointsBalance: number
  }
  redemption: {
    id: string
    rewardName: string
    pointsUsed: number
    status: string
  }
}

export function buildRedemptionWhatsAppUrl({ customer, redemption }: RedemptionWhatsAppInput) {
  const text = [
    'Nueva solicitud de canje Nocturne',
    '',
    `Cliente: ${customer.name}`,
    `Codigo: ${customer.code}`,
    `Telefono: ${customer.phone || 'No registrado'}`,
    `Email: ${customer.email || 'No registrado'}`,
    '',
    `Producto: ${redemption.rewardName}`,
    `Puntos usados: ${redemption.pointsUsed}`,
    `Balance restante: ${customer.pointsBalance}`,
    `Estado: ${redemption.status}`,
    `ID canje: ${redemption.id}`,
    '',
    'Quiero validar disponibilidad y coordinar entrega.',
  ].join('\n')

  return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`
}
