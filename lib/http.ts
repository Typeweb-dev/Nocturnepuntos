import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init)
}

export function jsonError(code: string, message: string, status = 400) {
  return NextResponse.json({ success: false, code, message }, { status })
}

export function validationError(error: unknown) {
  if (error instanceof ZodError) {
    return jsonError('VALIDATION_ERROR', error.issues[0]?.message ?? 'Datos invalidos.', 422)
  }

  return jsonError('SERVER_ERROR', 'No pudimos procesar la solicitud.', 500)
}

export async function readJson(request: Request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}
