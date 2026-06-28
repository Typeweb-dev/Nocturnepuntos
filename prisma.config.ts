import { config as loadEnv } from 'dotenv'
import { defineConfig, env } from 'prisma/config'

loadEnv({ path: '.env.local', override: false })
loadEnv({ path: '.env', override: false })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
})
