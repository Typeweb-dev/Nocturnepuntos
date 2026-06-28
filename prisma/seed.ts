import { createCipheriv, createHash, createHmac, randomBytes } from 'crypto'
import { config as loadEnv } from 'dotenv'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

loadEnv({ path: '.env.local', override: false })
loadEnv({ path: '.env', override: false })

const adapter = new PrismaPg(process.env.DATABASE_URL ?? 'postgresql://user:password@localhost:5432/nocturne_points')
const prisma = new PrismaClient({ adapter })

const qrSecret = process.env.QR_SECRET ?? 'nocturne-local-development-secret'

function generateSecureToken(bytes = 32) {
  return randomBytes(bytes).toString('base64url')
}

function hashQrToken(token: string) {
  return createHmac('sha256', qrSecret).update(token).digest('hex')
}

function encryptQrToken(token: string) {
  const key = createHash('sha256').update(qrSecret).digest()
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return [iv, authTag, ciphertext].map((part) => part.toString('base64url')).join('.')
}

async function main() {
  await prisma.auditLog.deleteMany()
  await prisma.pointTransaction.deleteMany()
  await prisma.redemption.deleteMany()
  await prisma.rewardQr.deleteMany()
  await prisma.order.deleteMany()
  await prisma.rewardRule.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.adminUser.deleteMany()

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@nocturne.test'
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123'

  await prisma.adminUser.create({
    data: {
      name: 'Nocturne Admin',
      email: adminEmail.toLowerCase(),
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: 'OWNER',
    },
  })

  const rule = await prisma.rewardRule.create({
    data: {
      name: 'Camisa gratis',
      pointsRequired: 100,
      rewardText: '100 puntos = 1 camisa gratis',
      active: true,
    },
  })

  const seedCustomers = [
    ['NCT-001', 'Juan Perez', 90],
    ['NCT-002', 'Bradley David Rodriguez', 120],
    ['NCT-003', 'Hayla Makaraly Castillo', 55],
    ['NCT-004', 'Silma Bork', 10],
    ['NCT-005', 'Berenice Valladares', 10],
    ['NCT-006', 'Jeyling Ob', 10],
    ['NCT-007', 'Paola Dinarte', 40],
    ['NCT-008', 'Magdiel', 85],
    ['NCT-009', 'Dylan Caballero', 160],
  ] as const

  const customers = []

  for (const [code, name, points] of seedCustomers) {
    const customer = await prisma.customer.create({
      data: {
        code,
        name,
        email: `${code.toLowerCase()}@nocturne.test`,
        pointsBalance: points,
        status: 'ACTIVE',
      },
    })

    await prisma.pointTransaction.create({
      data: {
        customerId: customer.id,
        type: 'ADJUST',
        points,
        balanceAfter: points,
        description: 'Balance inicial migrado desde el sistema anterior.',
      },
    })

    customers.push(customer)
  }

  const orders = []

  for (let index = 0; index < 5; index += 1) {
    const customer = customers[index]
    const order = await prisma.order.create({
      data: {
        orderNumber: `NOC-${String(index + 1).padStart(4, '0')}`,
        customerId: customer.id,
        total: 35 + index * 12,
        status: index === 4 ? 'FULFILLED' : 'PAID',
      },
    })

    orders.push(order)
  }

  for (let index = 0; index < 3; index += 1) {
    const token = generateSecureToken()

    await prisma.rewardQr.create({
      data: {
        tokenHash: hashQrToken(token),
        tokenCiphertext: encryptQrToken(token),
        customerId: customers[index].id,
        orderId: orders[index].id,
        points: 75,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
    })
  }

  await prisma.redemption.create({
    data: {
      customerId: customers[1].id,
      pointsUsed: rule.pointsRequired,
      rewardName: rule.name,
      status: 'PENDING',
    },
  })

  await prisma.auditLog.create({
    data: {
      action: 'SEED',
      entity: 'System',
      description: 'Datos de prueba creados para Nocturne Points.',
    },
  })

  console.log('Seed complete.')
  console.log(`Admin: ${adminEmail} / ${adminPassword}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
