import { getRewardProgress } from '@/lib/points'

export function RewardProgress({
  points,
  required,
}: {
  points: number
  required: number
}) {
  const progress = getRewardProgress(points, required)

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-400">Progreso de recompensa</p>
          <p className="mt-1 text-white">{required} puntos = 1 camisa gratis</p>
        </div>
        <p className="font-mono text-sm text-zinc-300">{progress.percent}%</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full rounded-full bg-nocturne-accent" style={{ width: `${progress.percent}%` }} />
      </div>
      <p className="mt-3 text-sm text-zinc-400">
        {progress.ready ? 'Ya puedes solicitar tu recompensa.' : `Te faltan ${progress.remaining} puntos.`}
      </p>
    </div>
  )
}
