import { z } from 'zod'

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined))

export const customerCreateSchema = z.object({
  code: z.string().trim().min(3, 'El codigo del cliente es obligatorio.'),
  name: z.string().trim().min(2, 'El nombre del cliente es obligatorio.'),
  email: optionalText.pipe(z.string().email('El email no es valido.').optional()),
  phone: optionalText,
  pointsBalance: z.coerce.number().int().min(0).default(0),
  status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']).default('ACTIVE'),
})

export const customerUpdateSchema = customerCreateSchema.partial()

export const qrGenerateSchema = z.object({
  customerId: z.string().min(1, 'Selecciona un cliente.'),
  points: z.coerce.number().int().min(1).max(10000),
  expiresInDays: z.coerce.number().int().min(1).max(365),
})

export const qrClaimSchema = z.object({
  token: z.string().trim().min(24, 'Token invalido.'),
})

export const customerLoginSchema = z.object({
  code: z.string().trim().min(3, 'Ingresa tu Codigo Nocturne.').max(64, 'Codigo invalido.'),
})

export const pointsAdjustSchema = z.object({
  customerId: z.string().min(1, 'Selecciona un cliente.'),
  points: z.coerce.number().int().refine((value) => value !== 0, 'El ajuste no puede ser cero.'),
  type: z.enum(['ADJUST', 'CANCEL', 'EXPIRE']).default('ADJUST'),
  description: z.string().trim().min(4, 'Agrega una descripcion.'),
})

export const redemptionCreateSchema = z.object({
  customerId: z.string().min(1, 'Selecciona un cliente.'),
  pointsUsed: z.coerce.number().int().min(1),
  rewardName: z.string().trim().min(2, 'Nombre de recompensa requerido.'),
})

export const redemptionUpdateSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED']),
})

export const publicRedemptionSchema = z.object({
  rewardId: z.coerce.number().int().min(1).max(20),
})

export const rewardRuleUpdateSchema = z.object({
  name: z.string().trim().min(2),
  pointsRequired: z.coerce.number().int().min(1),
  rewardText: z.string().trim().min(2),
  active: z.coerce.boolean().default(true),
})

export const loginSchema = z.object({
  email: z.string().trim().email('Email invalido.'),
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres.'),
})
