import { NextRequest, NextResponse } from 'next/server'
import { createAdminSessionCookie } from '@/lib/auth'
import { jsonError, readJson, validationError } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/security'
import { loginSchema } from '@/validations/schemas'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const data = loginSchema.parse(await readJson(request))
    const admin = await prisma.adminUser.findUnique({
      where: { email: data.email.toLowerCase() },
    })

    if (!admin) {
      return jsonError('INVALID_CREDENTIALS', 'Email o contrasena incorrectos.', 401)
    }

    const valid = await verifyPassword(data.password, admin.passwordHash)

    if (!valid) {
      return jsonError('INVALID_CREDENTIALS', 'Email o contrasena incorrectos.', 401)
    }

    const response = NextResponse.json({
      success: true,
      admin: {
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    })

    const sessionCookie = await createAdminSessionCookie({
      sub: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    })
    response.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie)

    return response
  } catch (error) {
    return validationError(error)
  }
}
