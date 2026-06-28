import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/session'
import { updateSession } from '@/utils/supabase/middleware'

const adminApiPrefixes = [
  '/api/clientes',
  '/api/qrs/generar',
  '/api/qrs/',
  '/api/puntos/ajustar',
  '/api/canjes',
  '/api/dashboard',
  '/api/configuracion',
]

export async function proxy(request: NextRequest) {
  const supabaseResponse = await updateSession(request)
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/api/qrs/canjear')) {
    return supabaseResponse
  }

  const protectsAdminPage = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')
  const protectsAdminApi = adminApiPrefixes.some((prefix) => pathname.startsWith(prefix))

  if (!protectsAdminPage && !protectsAdminApi) {
    return supabaseResponse
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  const session = token ? await verifySessionToken(token) : null

  if (session) {
    return supabaseResponse
  }

  if (protectsAdminApi) {
    return NextResponse.json(
      { success: false, code: 'UNAUTHORIZED', message: 'Inicia sesion para continuar.' },
      { status: 401 },
    )
  }

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/admin/login'
  loginUrl.searchParams.set('next', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}
