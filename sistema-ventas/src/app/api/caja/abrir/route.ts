import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function POST(req: NextRequest) {
  const { usuarioId } = await req.json()

  if (!usuarioId) {
    return NextResponse.json({ error: 'usuarioId requerido' }, { status: 400 })
  }

  const cajaAbierta = await prisma.caja.findFirst({
    where: { usuarioId, cierre: null }
  })

  if (cajaAbierta) {
    return NextResponse.json({ error: 'Ya hay una caja abierta para este usuario' }, { status: 400 })
  }

  const nuevaCaja = await prisma.caja.create({
    data: {
      usuarioId,
      apertura: new Date()
    }
  })

  return NextResponse.json(nuevaCaja, { status: 201 })
}