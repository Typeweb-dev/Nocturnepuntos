import { Settings } from 'lucide-react'
import { RewardRuleForm } from '@/components/admin/RewardRuleForm'
import { BentoCard } from '@/components/ui/BentoCard'
import { getDefaultPointsPerQr, getDefaultQrExpirationDays } from '@/lib/env'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ConfiguracionPage() {
  const activeRule = await prisma.rewardRule.findFirst({
    where: { active: true },
    orderBy: { pointsRequired: 'asc' },
  })
  const activeRuleData = activeRule
    ? {
        name: activeRule.name,
        pointsRequired: activeRule.pointsRequired,
        rewardText: activeRule.rewardText,
        active: activeRule.active,
      }
    : null

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Configuracion</h1>
        <p className="mt-2 text-nocturne-light">Reglas del sistema, defaults operativos y datos de marca.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <BentoCard variant="default">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-nocturne-accent/10 p-3">
              <Settings className="h-6 w-6 text-nocturne-accent" />
            </div>
            <div>
              <p className="text-sm text-nocturne-light">Puntos por QR</p>
              <p className="mt-2 text-4xl font-bold text-white">{getDefaultPointsPerQr()}</p>
              <p className="mt-3 text-sm text-nocturne-light">
                Puedes cambiarlo con DEFAULT_POINTS_PER_QR o personalizarlo al generar cada QR.
              </p>
            </div>
          </div>
        </BentoCard>

        <BentoCard variant="default">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-nocturne-cyan/10 p-3">
              <Settings className="h-6 w-6 text-nocturne-cyan" />
            </div>
            <div>
              <p className="text-sm text-nocturne-light">Expiracion por defecto</p>
              <p className="mt-2 text-4xl font-bold text-white">{getDefaultQrExpirationDays()} dias</p>
              <p className="mt-3 text-sm text-nocturne-light">
                Puedes cambiarlo con DEFAULT_QR_EXPIRATION_DAYS o definirlo por QR.
              </p>
            </div>
          </div>
        </BentoCard>
      </div>

      <BentoCard variant="default">
        <h3 className="text-lg font-semibold text-white">Regla de recompensa activa</h3>
        <p className="mt-2 text-sm text-nocturne-light">
          Esta regla aparece en la consulta publica de puntos y filtra clientes listos para canje.
        </p>
        <div className="mt-6">
          <RewardRuleForm rule={activeRuleData} />
        </div>
      </BentoCard>

      <BentoCard variant="default">
        <h3 className="text-lg font-semibold text-white">Redes y marca</h3>
        <div className="mt-5 grid gap-3 text-sm text-nocturne-light sm:grid-cols-2">
          <div className="rounded-lg border border-nocturne-light/10 bg-nocturne-dark p-4">
            <p>Instagram</p>
            <p className="mt-1 text-white">@nocturne</p>
          </div>
          <div className="rounded-lg border border-nocturne-light/10 bg-nocturne-dark p-4">
            <p>Soporte</p>
            <p className="mt-1 text-white">support@nocturne.test</p>
          </div>
        </div>
      </BentoCard>
    </div>
  )
}
