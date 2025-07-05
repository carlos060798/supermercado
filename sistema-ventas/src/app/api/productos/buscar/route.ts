import { prisma } from '@/app/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const codigo = searchParams.get('codigo')

  if (!codigo) {
    return NextResponse.json({ error: 'Código requerido' }, { status: 400 })
  }

  const producto = await prisma.producto.findUnique({
    where: { codigoBarra: codigo },
  })

  if (!producto) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
  }

  return NextResponse.json(producto)
}
