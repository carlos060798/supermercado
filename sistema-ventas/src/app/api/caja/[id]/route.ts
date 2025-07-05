import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  const caja = await prisma.caja.findUnique({
    where: { id },
    include: {
      usuario: true
    }
  })

  if (!caja) {
    return NextResponse.json({ error: 'Caja no encontrada' }, { status: 404 })
  }

  return NextResponse.json(caja)
}
