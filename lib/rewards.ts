export type PublicReward = {
  id: number
  name: string
  cost: number
  description: string
}

export const publicRewards: PublicReward[] = [
  {
    id: 1,
    name: 'Tote Bag Nocturne',
    cost: 180,
    description: 'Canjea una tote bag exclusiva para completar tu outfit.',
  },
  {
    id: 2,
    name: 'Camisa personalizada',
    cost: 300,
    description: 'Desbloquea una camisa personalizada con estetica Nocturne.',
  },
  {
    id: 3,
    name: 'Hoodie Nocturne',
    cost: 500,
    description: 'Obten una hoodie premium de edicion especial.',
  },
]

export function getPublicReward(rewardId: number) {
  return publicRewards.find((reward) => reward.id === rewardId) ?? null
}
