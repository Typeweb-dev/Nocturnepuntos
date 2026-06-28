import { NextRequest } from 'next/server'
import { Prisma } from '@prisma/client'
import { deactivateCustomer, getCustomerById, updateCustomer } from '@/services/clientes.service'
import { jsonError, jsonOk, readJson, validationError } from '@/lib/http'

export const runtime = 'nodejs'

type Context = {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, context: Context) {
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
    const customer = await updateCustomer(id, await readJson(request))
    return jsonOk({ success: true, customer })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return jsonError('CUSTOMER_NOT_FOUND', 'Cliente no encontrado.', 404)
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return jsonError('CUSTOMER_CODE_EXISTS', 'Ya existe un cliente con ese codigo.', 409)
    }

    return validationError(error)
  }
}

export async function DELETE(_request: NextRequest, context: Context) {
  const { id } = await context.params

  try {
    const customer = await deactivateCustomer(id)
    return jsonOk({ success: true, customer })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return jsonError('CUSTOMER_NOT_FOUND', 'Cliente no encontrado.', 404)
    }

    return validationError(error)
  }
}
