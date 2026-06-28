import { NextRequest } from 'next/server'
import { Prisma } from '@prisma/client'
import { deactivateCustomer, getCustomerById, updateCustomer } from '@/services/clientes.service'
import { requireAdminSessionFromRequest } from '@/lib/auth'
import { jsonError, jsonOk, readJson, validationError } from '@/lib/http'

export const runtime = 'nodejs'

type Context = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: Context) {
  try {
    await requireAdminSessionFromRequest(request)
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return jsonError('UNAUTHORIZED', 'Inicia sesion para continuar.', 401)
    }

    return validationError(error)
  }

  const { id } = await context.params
  const customer = await getCustomerById(id)

  if (!customer) {
    return jsonError('CUSTOMER_NOT_FOUND', 'Cliente no encontrado.', 404)
  }

  return jsonOk({ success: true, customer })
}

export async function PUT(request: NextRequest, context: Context) {
  const { id } = await context.params

  try {
    await requireAdminSessionFromRequest(request)
    const customer = await updateCustomer(id, await readJson(request))
    return jsonOk({ success: true, customer })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return jsonError('UNAUTHORIZED', 'Inicia sesion para continuar.', 401)
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return jsonError('CUSTOMER_NOT_FOUND', 'Cliente no encontrado.', 404)
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return jsonError('CUSTOMER_CODE_EXISTS', 'Ya existe un cliente con ese codigo.', 409)
    }

    return validationError(error)
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  const { id } = await context.params

  try {
    await requireAdminSessionFromRequest(request)
    const customer = await deactivateCustomer(id)
    return jsonOk({ success: true, customer })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return jsonError('UNAUTHORIZED', 'Inicia sesion para continuar.', 401)
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return jsonError('CUSTOMER_NOT_FOUND', 'Cliente no encontrado.', 404)
    }

    return validationError(error)
  }
}
