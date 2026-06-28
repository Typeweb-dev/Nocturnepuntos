import { config as loadEnv } from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { getAppUrl, getDatabasePoolMax, getDatabaseUrl } from '../lib/env'

loadEnv({ path: '.env.local', override: false })
loadEnv({ path: '.env', override: false })

type RequiredVariable = 'QR_SECRET' | 'AUTH_SECRET'

function fail(message: string): never {
  console.error(`Production check failed: ${message}`)
  process.exit(1)
}

function readRequired(name: RequiredVariable) {
  const value = process.env[name]

  if (!value) {
    fail(`${name} is missing.`)
  }

  return value
}

function validateSecrets() {
  const qrSecret = readRequired('QR_SECRET')
  const authSecret = readRequired('AUTH_SECRET')

  if (qrSecret.length < 16) {
    fail('QR_SECRET must contain at least 16 characters.')
  }

  if (authSecret.length < 16) {
    fail('AUTH_SECRET must contain at least 16 characters.')
  }

  if (qrSecret === authSecret) {
    fail('QR_SECRET and AUTH_SECRET must be different values.')
  }
}

function validateAppUrl() {
  const appUrl = getAppUrl()

  try {
    const parsed = new URL(appUrl)

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      fail('NEXT_PUBLIC_APP_URL must start with http:// or https://.')
    }
  } catch {
    fail('NEXT_PUBLIC_APP_URL is not a valid URL.')
  }
}

async function validateDatabase() {
  const databaseUrl = getDatabaseUrl()
  const prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: databaseUrl,
      max: getDatabasePoolMax(),
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
      allowExitOnIdle: true,
    }),
  })

  try {
    await prisma.$queryRaw`SELECT 1`
    await prisma.adminUser.count()
    await prisma.rewardQr.count()
  } catch (error) {
    console.error(error)
    fail('Database connection or migrated tables are not ready. Run `pnpm run prisma:deploy` first.')
  } finally {
    await prisma.$disconnect()
  }
}

async function main() {
  validateSecrets()
  validateAppUrl()
  await validateDatabase()
  console.log('Production check passed: environment, database connection, and Prisma tables are ready.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
