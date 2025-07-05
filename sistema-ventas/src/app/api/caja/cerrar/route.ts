import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function POST(req: NextRequest) {
  const { usuarioId } = await req.json()

  if (!usuarioId) {
    return NextResponse.json({ error: 'usuarioId requerido' }, { status: 400 })
  }

  const caja = await prisma.caja.findFirst({
    where: { usuarioId, cierre: null }
  })

  if (!caja) {
    return NextResponse.json({ error: 'No hay caja abierta' }, { status: 400 })
  }

  // Calcular total ventas de esta jornada
  const ventas = await prisma.venta.findMany({
    where: {
      usuarioId,
      fecha: {
        gte: caja.apertura,
        lte: new Date()
      }
    }
  })

  const total = ventas.reduce((acc, venta) => acc + venta.total, 0)

  const cajaCerrada = await prisma.caja.update({
    where: { id: caja.id },
    data: {
      cierre: new Date(),
      total
    }
  })

  return NextResponse.json(cajaCerrada)
}
