import { prisma } from '@/app/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  const venta = await prisma.venta.findUnique({
    where: { id },
    include: {
      usuario: true,
      detalles: {
        include: { producto: true }
      }
    }
  })

  if (!venta) {
    return NextResponse.json({ error: 'Venta no encontrada' }, { status: 404 })
  }

  return NextResponse.json(venta)
}
