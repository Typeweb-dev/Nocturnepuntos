import { NextRequest } from 'next/server'
import { jsonOk, readJson, validationError } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { rewardRuleUpdateSchema } from '@/validations/schemas'

export const runtime = 'nodejs'

export async function PUT(request: NextRequest) {
  try {
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
    return validationError(error)
  }
}
