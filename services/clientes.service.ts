import { CustomerStatus, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { customerCreateSchema, customerUpdateSchema } from '@/validations/schemas'

export async function listCustomers(params?: { search?: string; status?: CustomerStatus }) {
  const search = params?.search?.trim()

  return prisma.customer.findMany({
    where: {
      ...(params?.status ? { status: params.status } : {}),
      ...(search
        ? {
            OR: [
              { code: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { phone: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ],
          }
        : {}),
    },
    orderBy: [{ createdAt: 'desc' }],
  })
}

export async function getCustomerById(id: string) {
  return prisma.customer.findUnique({
    where: { id },
    include: {
      rewardQrs: { orderBy: { createdAt: 'desc' }, take: 10 },
      transactions: { orderBy: { createdAt: 'desc' }, take: 20 },
      redemptions: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  })
}

export async function getCustomerByCode(code: string) {
  return prisma.customer.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      transactions: { orderBy: { createdAt: 'desc' }, take: 12 },
      redemptions: { orderBy: { createdAt: 'desc' }, take: 8 },
    },
  })
}

export async function createCustomer(input: unknown) {
  const data = customerCreateSchema.parse(input)

  return prisma.customer.create({
    data: {
      ...data,
      code: data.code.toUpperCase(),
    },
  })
}

export async function updateCustomer(id: string, input: unknown) {
  const data = customerUpdateSchema.parse(input)

  return prisma.customer.update({
    where: { id },
    data: {
      ...data,
      code: data.code?.toUpperCase(),
    },
  })
}

export async function deactivateCustomer(id: string) {
  return prisma.customer.update({
    where: { id },
    data: { status: CustomerStatus.INACTIVE },
  })
}
