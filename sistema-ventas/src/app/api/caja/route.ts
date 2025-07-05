import { prisma } from '@/app/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const cajas = await prisma.caja.findMany({
    include: {
      usuario: true
    },
    orderBy: { apertura: 'desc' }
  })

  return NextResponse.json(cajas)
}
