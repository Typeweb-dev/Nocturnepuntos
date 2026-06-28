export interface Customer {
  id: string
  code: string
  name: string
  email: string
  phone: string
  totalPoints: number
  usedPoints: number
  membershipLevel: 'bronze' | 'silver' | 'gold' | 'platinum'
  joinedDate: string
  lastActivityDate: string
  status: 'active' | 'inactive' | 'suspended'
  avatar?: string
}

// Catalog rewards shown to customers in the public rewards catalog
export interface CatalogReward {
  id: string
  name: string
  description: string
  tagline: string
  pointsRequired: number
  category: string
  status: 'AVAILABLE' | 'INACTIVE'
  image: string
  accent: 'blue' | 'neutral' | 'purple'
  icon: 'shirt' | 'bag' | 'hoodie'
}

// Catalog-based redemption requests (customer facing flow)
export interface CatalogRedemption {
  id: string
  customer: string
  customerCode: string
  reward: string
  pointsUsed: number
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED'
  requestedAt: string
}

export interface QRCode {
  id: string
  customerId: string
  code: string
  pointsValue: number
  expiresAt: string
  createdAt: string
  claimedAt?: string
  claimedBy?: string
  status: 'pending' | 'claimed' | 'expired' | 'revoked'
  metadata?: {
    campaign?: string
    source?: string
  }
}

export interface Activity {
  id: string
  customerId: string
  customerName: string
  type: 'qr_claimed' | 'points_redeemed' | 'membership_upgraded' | 'purchase' | 'admin_adjustment'
  pointsChange: number
  description: string
  timestamp: string
}

export interface Reward {
  id: string
  name: string
  pointsCost: number
  description: string
  image?: string
  available: number
}

export interface Redemption {
  id: string
  customerId: string
  customerName: string
  rewardId: string
  rewardName: string
  pointsSpent: number
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled'
  requestedAt: string
  approvedAt?: string
}

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: 'cust_001',
    code: 'NCT-001',
    name: 'Sofia Chen',
    email: 'sofia.chen@email.com',
    phone: '+1 (555) 234-5678',
    totalPoints: 2450,
    usedPoints: 450,
    membershipLevel: 'platinum',
    joinedDate: '2023-03-15',
    lastActivityDate: '2024-06-20',
    status: 'active',
  },
  {
    id: 'cust_002',
    code: 'NCT-002',
    name: 'Marcus Rodriguez',
    email: 'marcus.r@email.com',
    phone: '+1 (555) 345-6789',
    totalPoints: 1800,
    usedPoints: 700,
    membershipLevel: 'gold',
    joinedDate: '2023-06-22',
    lastActivityDate: '2024-06-18',
    status: 'active',
  },
  {
    id: 'cust_003',
    code: 'NCT-003',
    name: 'Elena Kowalski',
    email: 'elena.k@email.com',
    phone: '+1 (555) 456-7890',
    totalPoints: 950,
    usedPoints: 200,
    membershipLevel: 'silver',
    joinedDate: '2024-01-10',
    lastActivityDate: '2024-06-15',
    status: 'active',
  },
  {
    id: 'cust_004',
    code: 'NCT-004',
    name: 'James Torres',
    email: 'james.torres@email.com',
    phone: '+1 (555) 567-8901',
    totalPoints: 260,
    usedPoints: 100,
    membershipLevel: 'bronze',
    joinedDate: '2024-04-05',
    lastActivityDate: '2024-05-30',
    status: 'active',
  },
  {
    id: 'cust_005',
    code: 'NCT-005',
    name: 'Yuki Tanaka',
    email: 'yuki.tanaka@email.com',
    phone: '+1 (555) 678-9012',
    totalPoints: 3200,
    usedPoints: 1200,
    membershipLevel: 'platinum',
    joinedDate: '2022-11-08',
    lastActivityDate: '2024-06-21',
    status: 'active',
  },
  {
    id: 'cust_006',
    code: 'NCT-006',
    name: 'Amara Okonkwo',
    email: 'amara.o@email.com',
    phone: '+1 (555) 789-0123',
    totalPoints: 650,
    usedPoints: 150,
    membershipLevel: 'bronze',
    joinedDate: '2024-02-14',
    lastActivityDate: '2024-06-10',
    status: 'inactive',
  },
  {
    id: 'cust_007',
    code: 'NCT-007',
    name: 'Lucas Silva',
    email: 'lucas.silva@email.com',
    phone: '+1 (555) 890-1234',
    totalPoints: 1550,
    usedPoints: 350,
    membershipLevel: 'silver',
    joinedDate: '2023-09-20',
    lastActivityDate: '2024-06-12',
    status: 'active',
  },
  {
    id: 'cust_008',
    code: 'NCT-008',
    name: 'Nina Petrov',
    email: 'nina.p@email.com',
    phone: '+1 (555) 901-2345',
    totalPoints: 2100,
    usedPoints: 600,
    membershipLevel: 'gold',
    joinedDate: '2023-07-11',
    lastActivityDate: '2024-06-19',
    status: 'active',
  },
  {
    id: 'cust_009',
    code: 'NCT-009',
    name: 'Alex Kim',
    email: 'alex.kim@email.com',
    phone: '+1 (555) 012-3456',
    totalPoints: 800,
    usedPoints: 200,
    membershipLevel: 'silver',
    joinedDate: '2024-03-01',
    lastActivityDate: '2024-06-08',
    status: 'suspended',
  },
]

// Mock QR Codes
export const mockQRCodes: QRCode[] = [
  {
    id: 'qr_001',
    customerId: 'cust_001',
    code: 'NRN-2024-ABC123',
    pointsValue: 100,
    expiresAt: '2024-09-15',
    createdAt: '2024-06-15',
    claimedAt: '2024-06-18',
    claimedBy: 'Sofia Chen',
    status: 'claimed',
  },
  {
    id: 'qr_002',
    customerId: 'cust_002',
    code: 'NRN-2024-DEF456',
    pointsValue: 150,
    expiresAt: '2024-09-20',
    createdAt: '2024-06-16',
    status: 'pending',
  },
  {
    id: 'qr_003',
    customerId: 'cust_005',
    code: 'NRN-2024-GHI789',
    pointsValue: 200,
    expiresAt: '2024-08-30',
    createdAt: '2024-06-10',
    claimedAt: '2024-06-12',
    claimedBy: 'Yuki Tanaka',
    status: 'claimed',
  },
  {
    id: 'qr_004',
    customerId: 'cust_003',
    code: 'NRN-2024-JKL012',
    pointsValue: 75,
    expiresAt: '2024-07-15',
    createdAt: '2024-06-01',
    status: 'expired',
  },
  {
    id: 'qr_005',
    customerId: 'cust_008',
    code: 'NRN-2024-MNO345',
    pointsValue: 125,
    expiresAt: '2024-10-01',
    createdAt: '2024-06-20',
    status: 'pending',
  },
]

// Mock Activity
export const mockActivity: Activity[] = [
  {
    id: 'act_001',
    customerId: 'cust_001',
    customerName: 'Sofia Chen',
    type: 'qr_claimed',
    pointsChange: 100,
    description: 'Claimed QR code NRN-2024-ABC123',
    timestamp: '2024-06-18T14:30:00Z',
  },
  {
    id: 'act_002',
    customerId: 'cust_005',
    customerName: 'Yuki Tanaka',
    type: 'qr_claimed',
    pointsChange: 200,
    description: 'Claimed QR code NRN-2024-GHI789',
    timestamp: '2024-06-12T10:15:00Z',
  },
  {
    id: 'act_003',
    customerId: 'cust_002',
    customerName: 'Marcus Rodriguez',
    type: 'points_redeemed',
    pointsChange: -300,
    description: 'Redeemed Nocturne Hoodie (Size M)',
    timestamp: '2024-06-15T16:45:00Z',
  },
  {
    id: 'act_004',
    customerId: 'cust_008',
    customerName: 'Nina Petrov',
    type: 'membership_upgraded',
    pointsChange: 0,
    description: 'Upgraded to Gold membership',
    timestamp: '2024-06-10T09:20:00Z',
  },
  {
    id: 'act_005',
    customerId: 'cust_007',
    customerName: 'Lucas Silva',
    type: 'purchase',
    pointsChange: 150,
    description: 'Purchase: Nocturne T-Shirt Black',
    timestamp: '2024-06-20T11:30:00Z',
  },
]

// Mock Rewards
export const mockRewards: Reward[] = [
  {
    id: 'reward_001',
    name: 'Nocturne Logo Hoodie',
    pointsCost: 500,
    description: 'Premium cotton blend hoodie with embroidered Nocturne logo',
    available: 15,
  },
  {
    id: 'reward_002',
    name: 'Limited Edition Tee Pack (3)',
    pointsCost: 350,
    description: 'Set of 3 exclusive limited edition t-shirts',
    available: 8,
  },
  {
    id: 'reward_003',
    name: '$25 Store Credit',
    pointsCost: 250,
    description: 'Digital store credit for any purchase',
    available: 50,
  },
  {
    id: 'reward_004',
    name: 'VIP Event Ticket',
    pointsCost: 800,
    description: 'Exclusive access to Nocturne VIP launch events',
    available: 3,
  },
  {
    id: 'reward_005',
    name: 'Custom Nocturne Cap',
    pointsCost: 300,
    description: 'Personalized cap with name embroidery',
    available: 12,
  },
]

// Mock Redemptions
export const mockRedemptions: Redemption[] = [
  {
    id: 'redeem_001',
    customerId: 'cust_002',
    customerName: 'Marcus Rodriguez',
    rewardId: 'reward_001',
    rewardName: 'Nocturne Logo Hoodie',
    pointsSpent: 500,
    status: 'fulfilled',
    requestedAt: '2024-06-15T16:45:00Z',
    approvedAt: '2024-06-16T10:00:00Z',
  },
  {
    id: 'redeem_002',
    customerId: 'cust_008',
    customerName: 'Nina Petrov',
    rewardId: 'reward_003',
    rewardName: '$25 Store Credit',
    pointsSpent: 250,
    status: 'pending',
    requestedAt: '2024-06-20T14:00:00Z',
  },
  {
    id: 'redeem_003',
    customerId: 'cust_005',
    customerName: 'Yuki Tanaka',
    rewardId: 'reward_004',
    rewardName: 'VIP Event Ticket',
    pointsSpent: 800,
    status: 'approved',
    requestedAt: '2024-06-18T09:30:00Z',
    approvedAt: '2024-06-19T11:15:00Z',
  },
]

// Catalog Rewards (customer-facing rewards catalog)
export const mockCatalogRewards: CatalogReward[] = [
  {
    id: 'reward-001',
    name: 'Camisa personalizada',
    description: 'Diseño personalizado aplicado en camiseta Nocturne.',
    tagline: 'Personaliza tu próxima pieza Nocturne.',
    pointsRequired: 100,
    category: 'Apparel',
    status: 'AVAILABLE',
    image: '/rewards/custom-shirt.png',
    accent: 'blue',
    icon: 'shirt',
  },
  {
    id: 'reward-002',
    name: 'Totebag Nocturne',
    description: 'Totebag urbana con arte exclusivo de la marca.',
    tagline: 'Accesorio urbano para uso diario.',
    pointsRequired: 80,
    category: 'Accessories',
    status: 'AVAILABLE',
    image: '/rewards/totebag.png',
    accent: 'neutral',
    icon: 'bag',
  },
  {
    id: 'reward-003',
    name: 'Hoodie Nocturne',
    description: 'Hoodie premium con diseño especial de temporada.',
    tagline: 'Recompensa premium de temporada.',
    pointsRequired: 250,
    category: 'Apparel',
    status: 'AVAILABLE',
    image: '/rewards/hoodie.png',
    accent: 'purple',
    icon: 'hoodie',
  },
]

// Catalog Redemptions (admin management of catalog redemption requests)
export const mockCatalogRedemptions: CatalogRedemption[] = [
  {
    id: 'RED-001',
    customer: 'Dylan Caballero',
    customerCode: 'NCT-009',
    reward: 'Camisa personalizada',
    pointsUsed: 100,
    status: 'PENDING',
    requestedAt: '2026-02-05',
  },
  {
    id: 'RED-002',
    customer: 'Bradley David Rodríguez',
    customerCode: 'NCT-002',
    reward: 'Totebag Nocturne',
    pointsUsed: 80,
    status: 'COMPLETED',
    requestedAt: '2026-01-26',
  },
  {
    id: 'RED-003',
    customer: 'Yuki Tanaka',
    customerCode: 'NCT-005',
    reward: 'Hoodie Nocturne',
    pointsUsed: 250,
    status: 'APPROVED',
    requestedAt: '2026-01-30',
  },
]

// Dashboard Stats
export interface DashboardStats {
  totalCustomers: number
  totalPointsDelivered: number
  totalQRsGenerated: number
  activeRedemptions: number
  totalRevenue: number
  averagePointsPerCustomer: number
}

export const mockDashboardStats: DashboardStats = {
  totalCustomers: mockCustomers.length,
  totalPointsDelivered: mockCustomers.reduce((sum, c) => sum + c.totalPoints, 0),
  totalQRsGenerated: mockQRCodes.length,
  activeRedemptions: mockRedemptions.filter(r => r.status === 'pending' || r.status === 'approved').length,
  totalRevenue: 45230,
  averagePointsPerCustomer: Math.round(mockCustomers.reduce((sum, c) => sum + c.totalPoints, 0) / mockCustomers.length),
}

// Charts data
export const mockChartData = [
  { date: 'Jun 1', points: 280 },
  { date: 'Jun 2', points: 350 },
  { date: 'Jun 3', points: 420 },
  { date: 'Jun 4', points: 310 },
  { date: 'Jun 5', points: 480 },
  { date: 'Jun 6', points: 220 },
  { date: 'Jun 7', points: 520 },
  { date: 'Jun 8', points: 410 },
  { date: 'Jun 9', points: 570 },
  { date: 'Jun 10', points: 340 },
  { date: 'Jun 11', points: 630 },
  { date: 'Jun 12', points: 490 },
  { date: 'Jun 13', points: 460 },
  { date: 'Jun 14', points: 520 },
  { date: 'Jun 15', points: 650 },
  { date: 'Jun 16', points: 380 },
  { date: 'Jun 17', points: 510 },
  { date: 'Jun 18', points: 620 },
  { date: 'Jun 19', points: 470 },
  { date: 'Jun 20', points: 710 },
]

export const mockTopCustomers = [
  { name: 'Yuki Tanaka', points: 3200, level: 'Platinum' },
  { name: 'Sofia Chen', points: 2450, level: 'Platinum' },
  { name: 'Nina Petrov', points: 2100, level: 'Gold' },
  { name: 'Marcus Rodriguez', points: 1800, level: 'Gold' },
  { name: 'Lucas Silva', points: 1550, level: 'Silver' },
]
