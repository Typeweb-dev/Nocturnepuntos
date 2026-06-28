export function getRewardProgress(pointsBalance: number, pointsRequired: number) {
  if (pointsRequired <= 0) {
    return {
      percent: 100,
      remaining: 0,
      ready: true,
    }
  }

  const percent = Math.min(100, Math.round((pointsBalance / pointsRequired) * 100))

  return {
    percent,
    remaining: Math.max(0, pointsRequired - pointsBalance),
    ready: pointsBalance >= pointsRequired,
  }
}
