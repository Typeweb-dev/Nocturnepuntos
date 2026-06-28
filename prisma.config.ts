import { config as loadEnv } from 'dotenv'
import { defineConfig } from 'prisma/config'
import { getDatabaseUrl } from './lib/env'

loadEnv({ path: '.env.local', override: false })
loadEnv({ path: '.env', override: false })

const isGenerateCommand = process.argv.includes('generate')
const databaseUrl = getDatabaseUrl({ allowGenerateFallback: isGenerateCommand })

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
