import { createCipheriv, createHash, createHmac, randomBytes } from 'crypto'
import { config as loadEnv } from 'dotenv'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { getDatabasePoolMax, getDatabaseUrl } from '../lib/env'

loadEnv({ path: '.env.local', override: false })
loadEnv({ path: '.env', override: false })

const databaseUrl = getDatabaseUrl()
const adapter = new PrismaPg({
  connectionString: databaseUrl,
  max: getDatabasePoolMax(),
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
  allowExitOnIdle: true,
})
const prisma = new PrismaClient({ adapter })

const isProduction = process.env.NODE_ENV === 'production'
const isRemoteDatabase = /(supabase|pooler|aws-|neon|railway|render|vercel)/i.test(databaseUrl)
const shouldSeedSampleData = process.env.SEED_SAMPLE_DATA === 'true'
const qrSecret = process.env.QR_SECRET ?? 'nocturne-local-development-secret'

function requiredEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback

  if (!value || (isProduction && value === fallback)) {
    throw new Error(`${name} is required for production seed.`)
  }

  return value
}

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

async function seedAdmin() {
  const adminEmail = requiredEnv('ADMIN_EMAIL', 'admin@nocturne.test').toLowerCase()
  const adminPassword = requiredEnv('ADMIN_PASSWORD', 'admin123')
  const strictCredentials = isProduction || isRemoteDatabase

  if (strictCredentials && (adminEmail === 'admin@nocturne.test' || adminPassword === 'admin123')) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must not use demo values for a remote database.')
  }

  if (strictCredentials && adminPassword.length < 10) {
    throw new Error('ADMIN_PASSWORD must contain at least 10 characters for a remote database.')
  }

  if (strictCredentials) {
    await prisma.adminUser.deleteMany({ where: { email: 'admin@nocturne.test' } })
  }

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      name: 'Nocturne Admin',
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: 'OWNER',
    },
    create: {
      name: 'Nocturne Admin',
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: 'OWNER',
    },
  })

  return adminEmail
}

async function seedDefaultRewardRule() {
  const activeRule = await prisma.rewardRule.findFirst({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  })

  if (activeRule) {
    return activeRule
  }

  return prisma.rewardRule.create({
    data: {
      name: 'Productos Nocturne',
      pointsRequired: 180,
      rewardText: '180 puntos o mas = canje por productos seleccionados',
      active: true,
    },
  })
}

async function seedSamples() {
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
    const existing = await prisma.customer.findUnique({ where: { code } })
    const customer =
      existing ??
      (await prisma.customer.create({
        data: {
          code,
          name,
          email: `${code.toLowerCase()}@nocturne.test`,
          pointsBalance: points,
          status: 'ACTIVE',
        },
      }))

    if (!existing && points > 0) {
      await prisma.pointTransaction.create({
        data: {
          customerId: customer.id,
          type: 'ADJUST',
          points,
          balanceAfter: points,
          description: 'Balance inicial de prueba.',
        },
      })
    }

    customers.push(customer)
  }

  for (let index = 0; index < 3; index += 1) {
    const customer = customers[index]
    const orderNumber = `NOC-${String(index + 1).padStart(4, '0')}`
    const order = await prisma.order.upsert({
      where: { orderNumber },
      update: {},
      create: {
        orderNumber,
        customerId: customer.id,
        total: 35 + index * 12,
        status: 'PAID',
      },
    })
    const existingQr = await prisma.rewardQr.findFirst({
      where: { orderId: order.id, status: 'PENDING' },
    })

    if (!existingQr) {
      const token = generateSecureToken()

      await prisma.rewardQr.create({
        data: {
          tokenHash: hashQrToken(token),
          tokenCiphertext: encryptQrToken(token),
          customerId: customer.id,
          orderId: order.id,
          points: 75,
          status: 'PENDING',
          expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        },
      })
    }
  }
}

async function main() {
  const adminEmail = await seedAdmin()
  await seedDefaultRewardRule()

  if (shouldSeedSampleData) {
    await seedSamples()
  }

  await prisma.auditLog.create({
    data: {
      action: 'SEED',
      entity: 'System',
      description: shouldSeedSampleData
        ? 'Seed seguro ejecutado con datos de prueba.'
        : 'Seed seguro ejecutado para admin y regla inicial.',
    },
  })

  console.log('Seed complete.')
  console.log(`Admin: ${adminEmail}`)
  console.log(`Sample data: ${shouldSeedSampleData ? 'created or updated' : 'skipped'}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
