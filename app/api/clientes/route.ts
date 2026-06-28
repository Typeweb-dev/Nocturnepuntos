import { NextRequest } from 'next/server'
import { CustomerStatus, Prisma } from '@prisma/client'
import { createCustomer, listCustomers } from '@/services/clientes.service'
import { jsonError, jsonOk, readJson, validationError } from '@/lib/http'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const statusParam = searchParams.get('status')
  const status = statusParam && Object.values(CustomerStatus).includes(statusParam as CustomerStatus)
    ? (statusParam as CustomerStatus)
    : undefined
  const customers = await listCustomers({
    search: searchParams.get('search') ?? undefined,
    status,
  })

  return jsonOk({ success: true, customers })
}

export async function POST(request: NextRequest) {
  try {
    const customer = await createCustomer(await readJson(request))
    return jsonOk({ success: true, customer }, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return jsonError('CUSTOMER_CODE_EXISTS', 'Ya existe un cliente con ese codigo.', 409)
    }

    return validationError(error)
  }
}
