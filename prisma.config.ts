import { config as loadEnv } from 'dotenv'
import { defineConfig } from 'prisma/config'

loadEnv({ path: '.env.local', override: false })
loadEnv({ path: '.env', override: false })

const isGenerateCommand = process.argv.includes('generate')
const databaseUrl =
  process.env.DATABASE_URL ??
  (isGenerateCommand ? 'postgresql://prisma:prisma@localhost:5432/nocturne_points' : undefined)

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for Prisma commands that connect to the database.')
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
})
