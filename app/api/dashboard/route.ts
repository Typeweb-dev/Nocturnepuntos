import { jsonOk } from '@/lib/http'
import { getDashboardMetrics } from '@/services/dashboard.service'

export const runtime = 'nodejs'

export async function GET() {
  const dashboard = await getDashboardMetrics()
  return jsonOk({ success: true, dashboard })
}
