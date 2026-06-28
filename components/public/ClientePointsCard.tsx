import { Card } from '@/components/ui/Card'
import { RewardProgress } from '@/components/public/RewardProgress'

type ClientePointsCardProps = {
  name: string
  code: string
  points: number
  rewardRequired: number
}

export function ClientePointsCard({ name, code, points, rewardRequired }: ClientePointsCardProps) {
  return (
    <Card className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.16em] text-nocturne-accent">{code}</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">{name}</h1>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm text-zinc-400">Puntos actuales</p>
          <p className="mt-1 text-5xl font-semibold text-white">{points}</p>
        </div>
      </div>
      <RewardProgress points={points} required={rewardRequired} />
    </Card>
  )
}
