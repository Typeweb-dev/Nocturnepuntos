import { NextRequest } from 'next/server'
import { requireAdminSessionFromRequest } from '@/lib/auth'
import { jsonError, jsonOk, readJson, validationError } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { rewardRuleUpdateSchema } from '@/validations/schemas'

export const runtime = 'nodejs'

export async function PUT(request: NextRequest) {
  try {
    await requireAdminSessionFromRequest(request)
    const data = rewardRuleUpdateSchema.parse(await readJson(request))

    const rule = await prisma.$transaction(async (tx) => {
      if (data.active) {
        await tx.rewardRule.updateMany({ data: { active: false } })
      }

      return tx.rewardRule.create({
        data,
      })
    })

    return jsonOk({ success: true, rule })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return jsonError('UNAUTHORIZED', 'Inicia sesion para continuar.', 401)
    }

    return validationError(error)
  }
}
